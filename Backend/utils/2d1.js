const { spawn } = require('child_process');
const path = require('path');

/**
 * Checks if an image exists inside another image and contains specific text
 * @param {string} templateImagePath - Path to the template image to search for
 * @param {string} targetImagePath - Path to the image to search in
 * @returns {Promise<{imageFound: boolean, textFound: boolean}>}
 */
function checkImageAndText(templateImagePath, targetImagePath) {
	return new Promise((resolve, reject) => {
		// Get the absolute path to the Python script
		const scriptPath = path.join(__dirname, 'image.py');

		// Spawn Python process
		const pythonProcess = spawn('python', [
			scriptPath,
			templateImagePath,
			targetImagePath,
		]);

		let output = '';
		let error = '';

		// Collect data from script
		pythonProcess.stdout.on('data', (data) => {
			output += data.toString();
		});

		pythonProcess.stderr.on('data', (data) => {
			error += data.toString();
		});

		// Handle process completion
		pythonProcess.on('close', (code) => {
			if (code !== 0) {
				reject(new Error(`Python process exited with code ${code}: ${error}`));
				return;
			}

			// Parse the output to determine results
			const imageFound = output.includes('✅ Image detected inside');
			const textFound = output.includes(
				"✅ Text 'fast school of computing' found in image"
			);

			resolve({
				imageFound,
				textFound,
			});
		});
	});
}

// Example usage
async function main() {
	try {
		const result = await checkImageAndText('template.png', 'target.png');
		console.log('Results:', result);
	} catch (error) {
		console.error('Error:', error.message);
	}
}

// Export the function
module.exports = {
	checkImageAndText,
};

// If this file is run directly, execute the example
if (require.main === module) {
	main();
}
