import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import checkIEEEReference from './ieeeReferenceChecker.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as pdf2img from 'pdf-img-convert';

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
	'Test Cases',
	'User Manual',
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
	'Test Cases': [
		'Test Cases',
		'TEST CASES',
		'test cases',
		'Testing',
		'TESTING',
		'testing',
		'Test Plan',
		'Test Scenarios',
	],
	'User Manual': [
		'User Manual',
		'USER MANUAL',
		'user manual',
		'User Guide',
		'USER GUIDE',
		'user guide',
		'Documentation',
		'DOCUMENTATION',
		'documentation',
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

const execAsync = promisify(exec);

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

		// Additional validation for Test Cases section
		const testCasesSection = this.findSectionContent('Test Cases', allText);
		if (testCasesSection) {
			// Count occurrences of "test case id" or similar patterns
			const testCaseIdCount = (
				testCasesSection.match(
					/test case id|test case #|test case number|test case identifier/gi
				) || []
			).length;

			if (testCaseIdCount < 5) {
				this.addResult(
					`Test Cases section should include at least 5 test cases. Found ${testCaseIdCount} test cases.`
				);
			}
		}

		// Additional validation for User Manual section
		const userManualSection = this.findSectionContent('User Manual', allText);
		if (!userManualSection) {
			this.addResult('User Manual section is missing');
		}
	}

	findSectionContent(sectionName, allText) {
		const variations = SECTION_VARIATIONS[sectionName];
		const sectionVariations = variations.map((v) => v.toLowerCase());
		const sectionStartIndex = Math.min(
			...sectionVariations.map((v) => allText.toLowerCase().indexOf(v))
		);

		if (sectionStartIndex === Infinity) return null;

		// Find the next section's start index
		const nextSectionIndex = Math.min(
			...REQUIRED_SECTIONS.filter((s) => s !== sectionName)
				.flatMap((s) => SECTION_VARIATIONS[s].map((v) => v.toLowerCase()))
				.map((v) => allText.toLowerCase().indexOf(v))
				.filter((i) => i > sectionStartIndex)
		);

		return allText.slice(
			sectionStartIndex,
			nextSectionIndex === Infinity ? undefined : nextSectionIndex
		);
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

		// Validate IEEE format references
		const ieeeValidation = await checkIEEEReference(referencesSectionText[0]);
		if (!ieeeValidation.isValid) {
			this.addResult(ieeeValidation.message);
		}
	}

	async validateSignatures(pdfPath) {
		console.log('Pdf path', pdfPath);
		try {
			console.log('Signatures being called');

			// Create output directory in the same directory as the PDF
			const outputDir = path.join(path.dirname(pdfPath), 'output');
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir);
			}

			// Build the pdftoppm command
			const outputPrefix = path.join(outputDir, 'o_page');
			const cmd = `pdftoppm -jpeg -r 300 "${pdfPath}" "${outputPrefix}"`;
			console.log('Running command:', cmd);
			await execAsync(cmd);

			// The output file for page 3 will be o_page-03.jpg
			const imagePath = `${outputPrefix}-03.jpg`;
			if (!fs.existsSync(imagePath)) {
				this.addResult('Failed to generate image for page 3 using pdftoppm.');
				console.error('Image not found:', imagePath);
				return;
			}
			console.log('Image for page 3 generated at:', imagePath);

			// Call Python script to check signatures
			const pythonScript = path.join(__dirname, 'setup.py');
			const imagePath2 = path.resolve(imagePath);
			const { stdout } = await execAsync(
				`python3 "${pythonScript}" "${imagePath2}"`
			);

			const results = JSON.parse(stdout);

			// Check results for each region
			for (const [regionId, data] of Object.entries(results)) {
				if (!data.has_signature) {
					this.addResult(`Missing signature in ${regionId}`);
				}
			}

			// Optionally, do not delete the image or output folder for inspection
		} catch (error) {
			this.addResult(`Error checking signatures: ${error.message}`);
		}
	}
}

export { PDFValidator };
