/**
 * IEEE Reference Checker
 *
 * This function validates whether a given reference string follows IEEE citation style.
 * It handles all IEEE reference types including:
 * - Journal articles
 * - Conference papers
 * - Books
 * - Book chapters
 * - Technical reports
 * - Standards
 * - Patents
 * - Websites
 * - Theses and dissertations
 * - Unpublished works
 *
 * @param {string} reference - The reference string to validate
 * @returns {Object} An object containing validation results and details
 */
function checkIEEEReference(reference) {
	// Initialize result object
	const result = {
		isValid: false,
		errors: [],
		warnings: [],
		components: {},
		referenceType: 'unknown',
	};

	// Basic validation
	if (!reference || typeof reference !== 'string') {
		result.errors.push('Invalid input: Reference must be a non-empty string');
		return result;
	}

	// Remove any leading/trailing whitespace
	reference = reference.trim();

	// Determine reference type
	const referenceType = determineReferenceType(reference);
	result.referenceType = referenceType;

	// Validate based on reference type
	switch (referenceType) {
		case 'journal':
			validateJournalReference(reference, result);
			break;
		case 'conference':
			validateConferenceReference(reference, result);
			break;
		case 'book':
			validateBookReference(reference, result);
			break;
		case 'bookChapter':
			validateBookChapterReference(reference, result);
			break;
		case 'technicalReport':
			validateTechnicalReportReference(reference, result);
			break;
		case 'standard':
			validateStandardReference(reference, result);
			break;
		case 'patent':
			validatePatentReference(reference, result);
			break;
		case 'website':
			validateWebsiteReference(reference, result);
			break;
		case 'thesis':
			validateThesisReference(reference, result);
			break;
		case 'unpublished':
			validateUnpublishedReference(reference, result);
			break;
		default:
			result.errors.push('Unable to determine reference type');
	}

	// Common IEEE formatting checks
	validateCommonFormatting(reference, result);

	// Determine overall validity
	result.isValid = result.errors.length === 0;

	return result;
}

function determineReferenceType(reference) {
	// Check for journal articles
	if (/in\s+[A-Za-z0-9\s.,]+(?:Journal|Transactions)/i.test(reference)) {
		return 'journal';
	}
	// Check for conference papers
	if (
		/in\s+[A-Za-z0-9\s.,]+(?:Conference|Symposium|Workshop)/i.test(reference)
	) {
		return 'conference';
	}
	// Check for books
	if (
		/[A-Za-z0-9\s.,]+(?:Publishing|Press|Books)/i.test(reference) &&
		!/in\s+[A-Za-z0-9\s.,]+(?:Chapter)/i.test(reference)
	) {
		return 'book';
	}
	// Check for book chapters
	if (/in\s+[A-Za-z0-9\s.,]+(?:Chapter)/i.test(reference)) {
		return 'bookChapter';
	}
	// Check for technical reports
	if (/(?:Technical\s+Report|Tech\.\s+Rep\.)/i.test(reference)) {
		return 'technicalReport';
	}
	// Check for standards
	if (/(?:IEEE\s+Std\.|Standard)/i.test(reference)) {
		return 'standard';
	}
	// Check for patents
	if (/(?:U\.S\.\s+Patent|Patent\s+No\.)/i.test(reference)) {
		return 'patent';
	}
	// Check for websites
	if (/\[Online\]|Available:|http[s]?:\/\//i.test(reference)) {
		return 'website';
	}
	// Check for theses
	if (/(?:Ph\.D\.\s+dissertation|Master's\s+thesis)/i.test(reference)) {
		return 'thesis';
	}
	// Check for unpublished works
	if (/(?:unpublished|in\s+preparation)/i.test(reference)) {
		return 'unpublished';
	}
	return 'unknown';
}

function validateJournalReference(reference, result) {
	// Required components for journal articles
	const hasAuthor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasJournal = /in\s+[A-Za-z0-9\s.,]+(?:Journal|Transactions)/i.test(
		reference
	);
	const hasVolume = /vol\.\s*\d+/i.test(reference);
	const hasIssue = /no\.\s*\d+/i.test(reference);
	const hasPages = /pp\.\s*\d+-\d+/.test(reference);
	const hasDOI = /doi:\s*10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i.test(reference);

	validateCommonComponents(reference, result, {
		hasAuthor,
		hasYear,
		hasTitle,
		hasDOI,
	});

	if (!hasJournal) {
		result.errors.push('Missing journal name');
	}
	if (!hasVolume) {
		result.warnings.push('Volume number may be missing');
	}
	if (!hasIssue) {
		result.warnings.push('Issue number may be missing');
	}
	if (!hasPages) {
		result.warnings.push('Page numbers may be missing');
	}
}

function validateConferenceReference(reference, result) {
	// Required components for conference papers
	const hasAuthor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasConference =
		/in\s+[A-Za-z0-9\s.,]+(?:Conference|Symposium|Workshop)/i.test(reference);
	const hasLocation =
		/in\s+[A-Za-z0-9\s.,]+(?:,\s*[A-Za-z0-9\s.,]+)*,\s*[A-Za-z0-9\s.,]+/.test(
			reference
		);
	const hasPages = /pp\.\s*\d+-\d+/.test(reference);
	const hasDOI = /doi:\s*10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i.test(reference);

	validateCommonComponents(reference, result, {
		hasAuthor,
		hasYear,
		hasTitle,
		hasDOI,
	});

	if (!hasConference) {
		result.errors.push('Missing conference name');
	}
	if (!hasLocation) {
		result.warnings.push('Conference location may be missing');
	}
	if (!hasPages) {
		result.warnings.push('Page numbers may be missing');
	}
}

function validateBookReference(reference, result) {
	// Required components for books
	const hasAuthor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasPublisher = /[A-Za-z0-9\s.,]+(?:Publishing|Press|Books)/i.test(
		reference
	);
	const hasLocation = /[A-Za-z0-9\s.,]+(?:,\s*[A-Za-z0-9\s.,]+)*/.test(
		reference
	);
	const hasEdition = /(?:[0-9]+(?:st|nd|rd|th)\s+ed\.|edition)/i.test(
		reference
	);

	validateCommonComponents(reference, result, {
		hasAuthor,
		hasYear,
		hasTitle,
	});

	if (!hasPublisher) {
		result.errors.push('Missing publisher information');
	}
	if (!hasLocation) {
		result.warnings.push('Publisher location may be missing');
	}
	if (!hasEdition) {
		result.warnings.push('Edition information may be missing');
	}
}

function validateBookChapterReference(reference, result) {
	// Required components for book chapters
	const hasAuthor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasBookTitle = /in\s+[A-Za-z0-9\s.,]+(?:Chapter)/i.test(reference);
	const hasEditor = /\(Eds\.\)|\(Ed\.\)/.test(reference);
	const hasPages = /pp\.\s*\d+-\d+/.test(reference);
	const hasPublisher = /[A-Za-z0-9\s.,]+(?:Publishing|Press|Books)/i.test(
		reference
	);

	validateCommonComponents(reference, result, {
		hasAuthor,
		hasYear,
		hasTitle,
	});

	if (!hasBookTitle) {
		result.errors.push('Missing book title');
	}
	if (!hasEditor) {
		result.warnings.push('Editor information may be missing');
	}
	if (!hasPages) {
		result.warnings.push('Page numbers may be missing');
	}
	if (!hasPublisher) {
		result.warnings.push('Publisher information may be missing');
	}
}

function validateTechnicalReportReference(reference, result) {
	// Required components for technical reports
	const hasAuthor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasReportType = /(?:Technical\s+Report|Tech\.\s+Rep\.)/i.test(
		reference
	);
	const hasReportNumber = /(?:Report|Rep\.)\s+No\.\s*[A-Za-z0-9-]+/.test(
		reference
	);
	const hasInstitution =
		/[A-Za-z0-9\s.,]+(?:University|Institute|Laboratory)/i.test(reference);

	validateCommonComponents(reference, result, {
		hasAuthor,
		hasYear,
		hasTitle,
	});

	if (!hasReportType) {
		result.errors.push('Missing report type');
	}
	if (!hasReportNumber) {
		result.warnings.push('Report number may be missing');
	}
	if (!hasInstitution) {
		result.warnings.push('Institution information may be missing');
	}
}

function validateStandardReference(reference, result) {
	// Required components for standards
	const hasStandardNumber = /(?:IEEE\s+Std\.|Standard)\s+[A-Za-z0-9.-]+/.test(
		reference
	);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasOrganization = /(?:IEEE|ISO|ANSI)/i.test(reference);

	if (!hasStandardNumber) {
		result.errors.push('Missing standard number');
	}
	if (!hasYear) {
		result.errors.push('Missing year');
	}
	if (!hasTitle) {
		result.errors.push('Missing title');
	}
	if (!hasOrganization) {
		result.warnings.push('Organization information may be missing');
	}
}

function validatePatentReference(reference, result) {
	// Required components for patents
	const hasInventor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasPatentNumber =
		/(?:U\.S\.\s+Patent|Patent\s+No\.)\s+[A-Za-z0-9-]+/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);

	if (!hasInventor) {
		result.errors.push('Missing inventor information');
	}
	if (!hasPatentNumber) {
		result.errors.push('Missing patent number');
	}
	if (!hasYear) {
		result.errors.push('Missing year');
	}
	if (!hasTitle) {
		result.errors.push('Missing title');
	}
}

function validateWebsiteReference(reference, result) {
	// Required components for websites
	const hasAuthor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasOnlineMarker = /\[Online\]/.test(reference);
	const hasAvailableMarker = /Available:/.test(reference);
	const hasURL = /http[s]?:\/\/[^\s,]+/.test(reference);
	const hasAccessDate = /Accessed:\s*\w+\s+\d{1,2},\s*\d{4}/.test(reference);

	if (!hasTitle) {
		result.errors.push('Missing title');
	}
	if (!hasOnlineMarker) {
		result.warnings.push('Missing [Online] marker');
	}
	if (!hasAvailableMarker) {
		result.warnings.push('Missing "Available:" marker');
	}
	if (!hasURL) {
		result.errors.push('Missing URL');
	}
	if (!hasAccessDate) {
		result.warnings.push('Missing access date');
	}

	// Optional components
	if (hasAuthor) {
		const authorMatch = reference.match(/^([A-Za-z]+(?:,\s*[A-Za-z]+)*)/);
		if (authorMatch) {
			result.components.authors = authorMatch[1];
		}
	}
	if (hasYear) {
		const yearMatch = reference.match(/\((\d{4})\)/);
		if (yearMatch) {
			result.components.year = yearMatch[1];
		}
	}
}

function validateThesisReference(reference, result) {
	// Required components for theses
	const hasAuthor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasThesisType = /(?:Ph\.D\.\s+dissertation|Master's\s+thesis)/i.test(
		reference
	);
	const hasInstitution = /[A-Za-z0-9\s.,]+(?:University|Institute)/i.test(
		reference
	);
	const hasLocation = /[A-Za-z0-9\s.,]+(?:,\s*[A-Za-z0-9\s.,]+)*/.test(
		reference
	);

	validateCommonComponents(reference, result, {
		hasAuthor,
		hasYear,
		hasTitle,
	});

	if (!hasThesisType) {
		result.errors.push('Missing thesis type');
	}
	if (!hasInstitution) {
		result.errors.push('Missing institution');
	}
	if (!hasLocation) {
		result.warnings.push('Location may be missing');
	}
}

function validateUnpublishedReference(reference, result) {
	// Required components for unpublished works
	const hasAuthor = /^[A-Za-z]+(?:,\s*[A-Za-z]+)*/.test(reference);
	const hasYear = /\(\d{4}\)/.test(reference);
	const hasTitle = /"[^"]+"|'[^']+'/.test(reference);
	const hasStatus =
		/(?:unpublished|in\s+preparation|submitted|in\s+press)/i.test(reference);

	validateCommonComponents(reference, result, {
		hasAuthor,
		hasYear,
		hasTitle,
	});

	if (!hasStatus) {
		result.errors.push('Missing status information');
	}
}

function validateCommonComponents(reference, result, components) {
	const { hasAuthor, hasYear, hasTitle, hasDOI } = components;

	if (hasAuthor) {
		const authorMatch = reference.match(/^([A-Za-z]+(?:,\s*[A-Za-z]+)*)/);
		if (authorMatch) {
			result.components.authors = authorMatch[1];
			if (!/^[A-Za-z]+(?:,\s*[A-Za-z]+)*$/.test(authorMatch[1])) {
				result.warnings.push('Author names may not be properly formatted');
			}
		}
	} else {
		result.errors.push('Missing or invalid author format');
	}

	if (hasYear) {
		const yearMatch = reference.match(/\((\d{4})\)/);
		if (yearMatch) {
			result.components.year = yearMatch[1];
			const currentYear = new Date().getFullYear();
			const year = parseInt(yearMatch[1]);
			if (year > currentYear) {
				result.warnings.push('Publication year is in the future');
			}
		}
	} else {
		result.errors.push('Missing or invalid year format');
	}

	if (hasTitle) {
		const titleMatch = reference.match(/["']([^"']+)["']/);
		if (titleMatch) {
			result.components.title = titleMatch[1];
		}
	} else {
		result.errors.push('Missing or invalid title format');
	}

	if (hasDOI) {
		const doiMatch = reference.match(
			/doi:\s*(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)/i
		);
		if (doiMatch) {
			result.components.doi = doiMatch[1];
		}
	}
}

function validateCommonFormatting(reference, result) {
	// Check for proper capitalization
	if (!/^[A-Z]/.test(reference)) {
		result.warnings.push('Reference should start with a capital letter');
	}

	// Check for proper ending
	if (!reference.endsWith('.')) {
		result.warnings.push('Reference should end with a period');
	}

	// Check for proper spacing
	if (/\s{2,}/.test(reference)) {
		result.warnings.push('Multiple spaces detected');
	}

	// Check for proper punctuation
	if (!/[,;.]/.test(reference)) {
		result.warnings.push('Reference may be missing proper punctuation');
	}
}

// Example usage:
// const journalReference = 'J. Smith, "A Study of IEEE References," in IEEE Transactions on Example, vol. 42, no. 3, pp. 123-456, 2023, doi: 10.1109/EXAMPLE.2023.1234567';
// const conferenceReference = 'J. Smith, "A Study of IEEE References," in Proc. IEEE Conf. Example, New York, NY, USA, 2023, pp. 123-456.';
// const bookReference = 'J. Smith, "A Study of IEEE References," New York, NY, USA: Example Publishing, 2023.';
// const websiteReference = 'J. Smith, "A Study of IEEE References," [Online]. Available: https://example.com/paper. [Accessed: Jan. 1, 2023].';
// const result = checkIEEEReference(journalReference);
// console.log(result);

export default checkIEEEReference;
