import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import checkIEEEReference from './ieeeReferenceChecker.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Constants for validation
const REQUIRED_SECTIONS = [
	'Abstract',
	'Executive Summary',
	'Introduction',
	'Project Vision',
	'Related Applications',
	'Software Requirements Specifications',
	'High-level and Low-level Design',
	'Conclusion',
	'References',
];

// Section variations mapping
const SECTION_VARIATIONS = {
	Abstract: [
		'Abstract',
		'ABSTRACT',
		'abstract',
		'Summary',
		'SUMMARY',
		'summary',
	],
	'Executive Summary': [
		'Executive Summary',
		'EXECUTIVE SUMMARY',
		'executive summary',
		'Executive Overview',
		'Project Summary',
	],
	Introduction: [
		'Introduction',
		'INTRODUCTION',
		'introduction',
		'Intro',
		'INTRO',
		'intro',
	],
	'Project Vision': [
		'Project Vision',
		'PROJECT VISION',
		'project vision',
		'Vision',
		'VISION',
		'vision',
		'Project Overview',
	],
	'Related Applications': [
		'Related Applications',
		'RELATED APPLICATIONS',
		'related applications',
		'Related Work',
		'Related Systems',
		'Existing Systems',
	],
	'Software Requirements Specifications': [
		'Software Requirements Specifications',
		'SRS',
		'Software Requirements',
		'Requirements Specification',
		'System Requirements',
	],
	'High-level and Low-level Design': [
		'High-level and Low-level Design',
		'System Design',
		'Architecture Design',
		'Design',
		'DESIGN',
		'design',
	],
	Conclusion: [
		'Conclusion',
		'CONCLUSION',
		'conclusion',
		'Conclusions',
		'CONCLUSIONS',
		'conclusions',
	],
	References: [
		'References',
		'REFERENCES',
		'references',
		'Bibliography',
		'BIBLIOGRAPHY',
		'bibliography',
		'Works Cited',
	],
};

const REQUIRED_REFERENCES = 5;
const MIN_LINE_SPACING = 1.15;

class PDFValidator {
	constructor() {
		this.results = [];
		this.isSatisfactory = true;
		this.pdfDocument = null;
		this.pageContents = [];
		this.metadata = null;
	}

	addResult(message, isError = true) {
		this.results.push(message);
		if (isError) {
			this.isSatisfactory = false;
		}
	}

	getFinalResult() {
		return {
			status: this.isSatisfactory ? 'Satisfactory' : 'Unsatisfactory',
			comments: this.results,
		};
	}

	async loadPDF(pdfPath) {
		try {
			const data = new Uint8Array(fs.readFileSync(pdfPath));
			this.pdfDocument = await pdfjsLib.getDocument({ data }).promise;
			this.metadata = await this.pdfDocument.getMetadata();

			// Load all pages
			for (let i = 1; i <= this.pdfDocument.numPages; i++) {
				const page = await this.pdfDocument.getPage(i);
				const content = await page.getTextContent();
				this.pageContents.push({
					pageNumber: i,
					content: content.items,
					viewport: page.getViewport({ scale: 1.0 }),
				});
			}
		} catch (error) {
			throw new Error(`Failed to load PDF: ${error.message}`);
		}
	}

	// Document Structure Validation
	async validateDocumentStructure() {
		const allText = this.pageContents
			.map((p) => p.content.map((i) => i.str).join(' '))
			.join(' ');

		// Check required sections with variations
		for (const section of REQUIRED_SECTIONS) {
			const variations = SECTION_VARIATIONS[section];
			const found = variations.some((variation) =>
				allText.toLowerCase().includes(variation.toLowerCase())
			);

			if (!found) {
				this.addResult(
					`Missing required section: ${section} (or its variations)`
				);
			} else if (section !== 'Conclusion') {
				// For each section except the main Conclusion, check if it has its own conclusion
				const sectionVariations = variations.map((v) => v.toLowerCase());
				const sectionStartIndex = Math.min(
					...sectionVariations.map((v) => allText.toLowerCase().indexOf(v))
				);

				// Find the next section's start index
				const nextSectionIndex = Math.min(
					...REQUIRED_SECTIONS.filter((s) => s !== section)
						.flatMap((s) => SECTION_VARIATIONS[s].map((v) => v.toLowerCase()))
						.map((v) => allText.toLowerCase().indexOf(v))
						.filter((i) => i > sectionStartIndex)
				);

				// Extract the section content
				const sectionContent = allText.slice(
					sectionStartIndex,
					nextSectionIndex === Infinity ? undefined : nextSectionIndex
				);

				// Check for conclusion in this section
				const hasConclusion =
					sectionContent.toLowerCase().includes('conclusion') ||
					sectionContent.toLowerCase().includes('summary');

				if (!hasConclusion) {
					this.addResult(`Section "${section}" is missing a conclusion`);
				}
			}
		}
	}

	// Content Quality Validation
	async validateContentQuality() {
		// Check line spacing
		for (const page of this.pageContents) {
			const { content } = page;
			const lines = content.reduce((acc, item) => {
				const y = item.transform[5];
				if (!acc[y]) acc[y] = [];
				acc[y].push(item);
				return acc;
			}, {});

			const linePositions = Object.keys(lines)
				.map(Number)
				.sort((a, b) => b - a);
			for (let i = 0; i < linePositions.length - 1; i++) {
				const spacing =
					(linePositions[i] - linePositions[i + 1]) /
					lines[linePositions[i]][0].transform[0];
				if (spacing < MIN_LINE_SPACING) {
					this.addResult(
						`Insufficient line spacing detected on page ${page.pageNumber}`
					);
					break;
				}
			}
		}
	}

	// References Validation
	async validateReferences() {
		const allText = this.pageContents
			.map((p) => p.content.map((i) => i.str).join(' '))
			.join(' ');

		// Count references (approximate) - This can be kept or removed depending on whether checkIEEEReference handles count.
		// For now, let's assume we still want a simple count check.
		const referenceCitationCount = (allText.match(/\\\[\\d+\\\]/g) || [])
			.length;
		if (referenceCitationCount < REQUIRED_REFERENCES) {
			this.addResult(
				`Insufficient reference citations in text. Found ${referenceCitationCount}, minimum required is ${REQUIRED_REFERENCES}`
			);
		}

		const referencesSectionText = allText.match(
			/References[\\s\\S]*?(?=Appendix|$)/i
		);
		if (!referencesSectionText) {
			this.addResult('References section not found');
			return;
		}

		// Split references by newline, assuming each reference is on a new line starting with a number like [1] or 1.
		// This regex looks for lines starting with an optional bracket, a number, a bracket or dot, and then whitespace.
		const referenceEntries = referencesSectionText[0]
			.split(/\\n\\s*(?:\\\[)?\\d+(?:\\\]|\\.)\\s+/)
			.filter((entry) => entry.trim().length > 5); // Filter out empty or very short entries

		if (referenceEntries.length < REQUIRED_REFERENCES) {
			this.addResult(
				`Insufficient number of reference entries in the bibliography. Found ${referenceEntries.length}, minimum required is ${REQUIRED_REFERENCES}`
			);
		}

		// Validate each reference entry using the IEEE checker
		referenceEntries.forEach((entry, index) => {
			// Prepend a dummy number if the split removed it, to match typical entry format for the checker
			const fullEntry = `[${index + 1}] ${entry.trim()}`;
			const result = checkIEEEReference(fullEntry);

			if (!result.isValid) {
				result.errors.forEach((error) => {
					this.addResult(
						`Reference ${index + 1} (content: "${entry.substring(
							0,
							50
						)}..."): ${error}`
					);
				});
			}
			// Optionally add warnings
			result.warnings.forEach((warning) => {
				this.addResult(
					`Reference ${index + 1} (content: "${entry.substring(
						0,
						50
					)}..."): ${warning}`,
					false
				); // Add warnings as non-errors
			});
		});
	}

	// Figures and Tables Validation
	async validateFiguresAndTables() {
		for (const page of this.pageContents) {
			const { content } = page;
			const text = content.map((item) => item.str).join(' ');

			// Check figure captions
			const figures =
				text.match(/Figure\s+\d+[\s\S]*?(?=Figure\s+\d+|$)/gi) || [];
			figures.forEach((figure) => {
				if (!figure.includes(':')) {
					this.addResult(`Figure missing caption on page ${page.pageNumber}`);
				} else {
					const caption = figure.split(':')[1].trim();
					if (caption.toLowerCase().startsWith('this figure')) {
						this.addResult(
							`Figure caption should not start with "This figure" on page ${page.pageNumber}`
						);
					}
				}
			});

			// Check table captions
			const tables = text.match(/Table\s+\d+[\s\S]*?(?=Table\s+\d+|$)/gi) || [];
			tables.forEach((table) => {
				if (!table.includes(':')) {
					this.addResult(`Table missing caption on page ${page.pageNumber}`);
				} else {
					const caption = table.split(':')[1].trim();
					if (caption.toLowerCase().startsWith('this table')) {
						this.addResult(
							`Table caption should not start with "This table" on page ${page.pageNumber}`
						);
					}
				}
			});
		}
	}

	// Anti-Plagiarism Validation
	async validateAntiPlagiarism() {
		const allText = this.pageContents
			.map((p) => p.content.map((i) => i.str).join(' '))
			.join(' ');

		const slicedText = allText.slice(0, 1000);
		console.log(slicedText);

		// Find Anti-Plagiarism section
		const startMarker = 'Anti-Plagiarism Declaration';
		const endMarker = "Author's Declaration";
		const startIndex = allText.indexOf(startMarker);
		const endIndex = allText.indexOf(endMarker);

		if (startIndex === -1 || endIndex === -1) {
			this.addResult('Anti-Plagiarism Declaration section not found');
			return;
		}

		const section = allText.slice(startIndex, endIndex);

		// Check for student names (approximate)
		const namePattern = /[A-Z][a-z]+\s+[A-Z][a-z]+/g;
		const names = section.match(namePattern) || [];
		if (names.length < 3) {
			this.addResult(
				'Insufficient number of student names in Anti-Plagiarism Declaration'
			);
		}

		// Check for signatures (approximate)
		const signatureCount = (section.match(/signature/gi) || []).length;
		if (signatureCount < 3) {
			this.addResult(
				'Insufficient number of signatures in Anti-Plagiarism Declaration'
			);
		}
	}

	async validate(pdfPath) {
		try {
			await this.loadPDF(pdfPath);
			await this.validateDocumentStructure();
			await this.validateContentQuality();
			await this.validateReferences();
			await this.validateFiguresAndTables();
			await this.validateAntiPlagiarism();

			return this.getFinalResult();
		} catch (error) {
			return {
				status: 'Unsatisfactory',
				comments: [`Error during validation: ${error.message}`],
			};
		}
	}
}

export default PDFValidator;
