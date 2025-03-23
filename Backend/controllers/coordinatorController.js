import { exec } from 'child_process';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

let result = [];
const __dirname = dirname(fileURLToPath(import.meta.url));

function extractErrorFromLog(logContent) {
	const errorMatch = logContent.match(/! (.*?)\n/); // Look for the first LaTeX error
	return errorMatch
		? errorMatch[1]
		: 'Unknown error. Please review the log file manually.';
}

const extractStudentNames = (latexContent) => {
	let regex = /\\newcommand\{\\Studentone\}\{([\s\S]*?)\}/;
	const students = {};
	let commandName;

	let match;
	if ((match = regex.exec(latexContent)) !== null) {
		commandName = 'Studentone';
		students[commandName] = match[1].split(/\d/)[0].trim(); // Extract just the name part
	}

	regex = /\\newcommand\{\\Studenttwo\}\{([\s\S]*?)\}/;

	if ((match = regex.exec(latexContent)) !== null) {
		commandName = 'Studenttwo';
		students[commandName] = match[1].split(/\d/)[0].trim(); // Extract just the name part
	}

	regex = /\\newcommand\{\\Studentthree\}\{([\s\S]*?)\}/;

	if ((match = regex.exec(latexContent)) !== null) {
		commandName = 'Studentthree';
		students[commandName] = match[1].split(/\d/)[0].trim(); // Extract just the name part
	}
};

function checkNames(latexContent, studentNames) {
	const startMarker = 'Anti-Plagiarism Declaration';
	const endMarker = "Author's Declaration";

	const startIndex = latexContent.indexOf(startMarker);
	const endIndex = latexContent.indexOf(endMarker);

	if (startIndex === -1 || endIndex === -1) {
		return null;
	}

	const contentBetweenSections = latexContent
		.slice(startIndex + startMarker.length, endIndex)
		.trim();

	const foundNames = {};
	for (let studentKey in studentNames) {
		const studentName = studentNames[studentKey];
		if (contentBetweenSections.includes(studentName)) {
			foundNames[studentKey] = studentName;
		}
	}
	if (Object.keys(foundNames).length < 3) {
		console.log('Names missing!');
		result.push({ value: 0, comment: 'Names missing!' });
	} else {
		console.log('All names found');
		result.push({ value: 1, comment: 'All names found.' });
	}

	const graphicsCount = (
		contentBetweenSections.match(/\\includegraphics/g) || []
	).length;

	if (graphicsCount < 3) {
		console.log(`Signatures missing!`);
		result.push({ value: 0, comment: 'Signatures missing!' });
	} else {
		console.log('All signatures found!');
		result.push({ value: 1, comment: 'All signatures found' });
	}
}

function checkHeadings(latexContent) {
	const regex =
		/\\(section|section\*|chapter|subsection|subsubsection)\{([^}]*):\}/g;

	let match;
	let issues = false;
	while ((match = regex.exec(latexContent)) !== null) {
		console.log(`Colon after heading found: ${match[2]}`);
		result.push({
			value: 0,
			comment: `Colon after heading found: ${match[2]}`,
		});
		issues = true;
	}
	if (issues == false) {
		console.log('All headings are fine');
		result.push({ value: 1, comment: 'All headings are fine' });
	}
}

function checkChapterConclusion(latexString) {
	// Regular expression to find each \chapter{...} and check for a \section{Conclusion} following it
	const regex = /\\chapter\{([^}]+)\}(?![\s\S]*?\\section\{Conclusion\})/g;

	let match;
	while ((match = regex.exec(latexString)) !== null) {
		// Log only the chapter name (captured group 1)
		console.log(`Conclusion is missing after: ${match[1]}`);
		result.push({
			value: 0,
			comment: `Conclusion is missing after: ${match[1]}`,
		});
	}
}

const checkCaptionsFigures = (latexContent) => {
	// Regular expression to match each figure block
	const figureBlocks = latexContent.match(
		/\\begin{figure}[\s\S]*?\\end{figure}/g
	);

	if (!figureBlocks) {
		console.log('No figures found in the content.');
		return;
	}

	let allFiguresValid = true;

	const pathRegex = /\\includegraphics(?:\[[^\]]*])?\{(.*?)\}/;
	const captionRegex = /\\caption\{(.*?)\}/;
	let currentpath;
	let captionMatch;
	let caption;
	for (const figureBlock of figureBlocks) {
		currentpath = figureBlock.match(pathRegex);
		if (!figureBlock.includes('\\caption')) {
			console.log('Missing captions in the following figure(s):');
			console.log(currentpath[1]);
			result.push({
				value: 0,
				comment: `Missing captions in the following figure(s): ${currentpath[1]}`,
			});
			allFiguresValid = false;
			continue;
		}
		captionMatch = figureBlock.match(captionRegex);
		caption = captionMatch[1];
		if (caption.toLowerCase().includes('this figure')) {
			console.log('Captions cannot begin with "This figure..."');
			result.push({
				value: 0,
				comment: 'Captions cannot begin with "This figure..."',
			});
		}
	}

	if (allFiguresValid) {
		console.log('All figures contain captions.');
		result.push({ value: 1, comment: 'All figures contain captions.' });
	}
};

function checkCaptionsInUseCases(latexString) {
	// Regular expression to match \section{Use Cases} and capture everything until the next \section{name}
	const sectionRegex = /\\section\{Use Cases\}([\s\S]*?)(?=\\section\{)/g;

	let sectionMatch;
	while ((sectionMatch = sectionRegex.exec(latexString)) !== null) {
		const content = sectionMatch[1]; // Content between \section{Use Cases} and the next \section{name}

		// Regular expression to match all \caption{name} within the content
		const captionRegex = /\\caption\{([^}]+)\}/g;

		let captionMatch;
		let issues = false;
		while ((captionMatch = captionRegex.exec(content)) !== null) {
			console.log(`Caption found: ${captionMatch[1]}`);
			result.push({ value: 0, comment: `Caption found: ${captionMatch[1]}` });
			issues = true;
		}

		// If no captions are found in the Use Cases section
		if (!issues) {
			console.log("No caption found in the 'Use Cases' section.");
			result.push({
				value: 1,
				comment: "No caption found in the 'Use Cases' section.",
			});
		}
	}
}

function checkReferences(bibtext) {
	const entries = bibtext
		.split('\n@')
		.filter((entry) => entry.trim().length > 0)
		.map((entry) => '@' + entry.trim());

	if (entries.length > 0 && entries[0].startsWith('@@')) {
		entries[0] = entries[0].slice(1); // Remove the extra '@' from the first entry
	}

	const issues = [];

	const formattedEntries = entries.join('\n\n');

	const requiredMiscFields = ['howpublished'];
	const requiredBookFields = ['author', 'title', 'year'];

	entries.forEach((entry) => {
		const match = entry.match(/^@(\w+)\{/);
		if (!match) {
			issues.push(`Invalid entry format: ${entry}`);
			return;
		}
		const type = match[1];

		const fields = {};
		const fieldRegex = /(\w+)\s*=\s*[\{\"](.+?)[\}\"]/g;
		let fieldMatch;
		while ((fieldMatch = fieldRegex.exec(entry)) !== null) {
			fields[fieldMatch[1].toLowerCase()] = fieldMatch[2];
		}

		// Validate fields based on type
		if (type.toLowerCase() === 'misc') {
			requiredMiscFields.forEach((field) => {
				if (!fields[field]) {
					issues.push(
						`Missing required field "${field}" in @Misc entry: ${entry}`
					);
				} else if (
					field === 'howpublished' &&
					!/\bhttps?:\/\/\S+/.test(fields[field])
				) {
					issues.push(
						`Field "howpublished" in @Misc entry must contain a URL: ${entry}`
					);
				}
			});
		} else if (type.toLowerCase() === 'book') {
			requiredBookFields.forEach((field) => {
				if (!fields[field]) {
					issues.push(
						`Missing required field "${field}" in @Book entry: ${entry}`
					);
				}
			});
		}
	});

	if (issues.length > 0) {
		console.log('Validation issues found:');
		issues.forEach((issue) => console.log('  -', issue));
		result.push(issues);
		return false;
	} else {
		console.log('All references are valid.');
		result.push({ value: 1, comment: 'All references are valid.' });
		return true;
	}
}


export const checkFile=(req,res)=>{
	
    result = [];
	if (!req.file) {
		return res.status(400).send({ message: 'No file uploaded!' });
	}

	const zipPath = req.file.path;
	const zipName = path.parse(req.file.originalname).name; // Name of the ZIP file (without extension)
	const extractPath = path.join(__dirname, 'extracted');

	try {
		// Extract ZIP file
		const zip = new AdmZip(zipPath);
		zip.extractAllTo(extractPath, true);

		// List extracted files
		let files = fs.readdirSync(extractPath);

		// Remove uploaded ZIP to save space
		fs.unlinkSync(zipPath);

		//Check References
		let bibFile = files.find((file) => file.endsWith('.bib'));
		let bibtext;
		let targetDirPath = path.join(extractPath, zipName);
		if (!bibFile) {
			if (fs.existsSync(targetDirPath)) {
				files = fs.readdirSync(targetDirPath);
				bibFile = files.find((file) => file.endsWith('.bib'));
				bibtext = fs.readFileSync(`${targetDirPath}/${bibFile}`, 'utf-8');
			}
			if (!bibFile) {
				targetDirPath = path.join(extractPath, 'FYPFast');
				if (fs.existsSync(targetDirPath)) {
					files = fs.readdirSync(targetDirPath);
					bibFile = files.find((file) => file.endsWith('.bib'));
					bibtext = fs.readFileSync(`${targetDirPath}/${bibFile}`, 'utf-8');
				} else {
					console.log('No bib file found!');
				}
			}
		} else {
			bibtext = fs.readFileSync(`${extractPath}/${bibFile}`, 'utf-8');
		}
		checkReferences(bibtext);

		//Check tex file
		files = fs.readdirSync(extractPath);
		let texFile = files.find((file) => file.endsWith('.tex'));
		let textext;
		let texpath;
		if (!texFile) {
			targetDirPath = path.join(extractPath, zipName);
			if (fs.existsSync(targetDirPath)) {
				files = fs.readdirSync(targetDirPath);
				texFile = files.find((file) => file.endsWith('.tex'));
				texpath = `${targetDirPath}`;
				textext = fs.readFileSync(`${targetDirPath}/${texFile}`, 'utf-8');
			}
			if (!texFile) {
				targetDirPath = path.join(extractPath, 'FYPFast');
				if (fs.existsSync(targetDirPath)) {
					files = fs.readdirSync(targetDirPath);
					texFile = files.find((file) => file.endsWith('.tex'));
					console.log(texFile);
					texpath = `${targetDirPath}`;
					textext = fs.readFileSync(`${targetDirPath}/${texFile}`, 'utf-8');
				} else {
					console.log('No tex file found!');
				}
			}
		} else {
			texpath = `${extractPath}`;
			textext = fs.readFileSync(`${extractPath}/${texFile}`, 'utf-8');
		}
		const pdfFile = path.join(texpath, texFile.replace('.tex', '.pdf'));

		const command = `cd "${texpath}" && C:/Users/Lenovo/AppData/Local/Programs/MiKTeX/miktex/bin/x64/pdflatex -interaction=nonstopmode "${texFile}"`;

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.log("Error was,",error);
			}

			if (fs.existsSync(pdfFile)) {
				console.log('Compilation successful! Valid Latex File.');
			} else {
				console.error('PDF not generated. Checking log file for issues...');
			}
		});
		const students = extractStudentNames(textext);
		checkNames(textext, students);
		checkCaptionsFigures(textext);
		checkHeadings(textext);
		checkChapterConclusion(textext);
		checkCaptionsInUseCases(textext);
		//findPageNumber(pdfFile);
		res.status(200).send(result);
	} catch (error) {
		res
			.status(500)
			.send({ message: 'Error processing ZIP file', error, result });
	}

}



export const downloadFile=(req,res)=>{
	
	result = [];
	if (!req.file) {
		return res.status(400).send({ message: 'No file uploaded!' });
	}

	const zipPath = req.file.path;
	const zipName = path.parse(req.file.originalname).name; // Name of the ZIP file (without extension)
	const extractPath = path.join(__dirname, 'extracted');

	try {
		// Extract ZIP file
		const zip = new AdmZip(zipPath);
		zip.extractAllTo(extractPath, true);

		// List extracted files
		let files = fs.readdirSync(extractPath);

		// Remove uploaded ZIP to save space
		fs.unlinkSync(zipPath);

		//Check References
		let bibFile = files.find((file) => file.endsWith('.bib'));
		let bibtext;
		let targetDirPath = path.join(extractPath, zipName);
		if (!bibFile) {
			if (fs.existsSync(targetDirPath)) {
				files = fs.readdirSync(targetDirPath);
				bibFile = files.find((file) => file.endsWith('.bib'));
				bibtext = fs.readFileSync(`${targetDirPath}/${bibFile}`, 'utf-8');
			}
			if (!bibFile) {
				targetDirPath = path.join(extractPath, 'FYPFast');
				if (fs.existsSync(targetDirPath)) {
					files = fs.readdirSync(targetDirPath);
					bibFile = files.find((file) => file.endsWith('.bib'));
					bibtext = fs.readFileSync(`${targetDirPath}/${bibFile}`, 'utf-8');
				} else {
					console.log('No bib file found!');
				}
			}
		} else {
			bibtext = fs.readFileSync(`${extractPath}/${bibFile}`, 'utf-8');
		}
		checkReferences(bibtext);

		//Check tex file
		files = fs.readdirSync(extractPath);
		let texFile = files.find((file) => file.endsWith('.tex'));
		let textext;
		let texpath;
		if (!texFile) {
			targetDirPath = path.join(extractPath, zipName);
			if (fs.existsSync(targetDirPath)) {
				files = fs.readdirSync(targetDirPath);
				texFile = files.find((file) => file.endsWith('.tex'));
				texpath = `${targetDirPath}`;
				textext = fs.readFileSync(`${targetDirPath}/${texFile}`, 'utf-8');
			}
			if (!texFile) {
				targetDirPath = path.join(extractPath, 'FYPFast');
				if (fs.existsSync(targetDirPath)) {
					files = fs.readdirSync(targetDirPath);
					texFile = files.find((file) => file.endsWith('.tex'));
					console.log(texFile);
					texpath = `${targetDirPath}`;
					textext = fs.readFileSync(`${targetDirPath}/${texFile}`, 'utf-8');
				} else {
					console.log('No tex file found!');
				}
			}
		} else {
			texpath = `${extractPath}`;
			textext = fs.readFileSync(`${extractPath}/${texFile}`, 'utf-8');
		}
		const pdfFile = path.join(texpath, texFile.replace('.tex', '.pdf'));

		const command = `cd "${texpath}" && C:/Users/Lenovo/AppData/Local/Programs/MiKTeX/miktex/bin/x64/pdflatex -interaction=nonstopmode "${texFile}"`;

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.log("Error was,",error);
			}

			if (fs.existsSync(pdfFile)) {
				console.log('Compilation successful! Valid Latex File.');
			} else {
				console.error('PDF not generated. Checking log file for issues...');
			}
		});

		res.download(pdfFile, `${zipName}.pdf`, (err) => {
			if (err) {
				console.error('Error sending the file:', err);
				res.status(500).send('Error downloading the file');
			}
		});
	}
	catch(error){
		res
			.status(500)
			.send({ message: 'Error processing ZIP file', error, result });
	}
}