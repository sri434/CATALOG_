// Function to decode Y values from different bases
function decodeY(encodedY, base) {
    return parseInt(encodedY, base);
}

// Function to perform Lagrange Interpolation to find the constant (secret)
function lagrangeInterpolation(points) {
    const n = points.length;
    let constant = 0;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];

        let term = yi;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                let xj = points[j][0];
                term *= -xj / (xi - xj);
            }
        }
        constant += term;
    }

    return constant;
}

// Function to process input data from JSON
function processInput(data) {
    let points = Object.keys(data)
        .filter(key => !isNaN(parseInt(key)))
        .map(x => [parseInt(x), decodeY(data[x].value, data[x].base)]);

    // Find the constant for the given test case
    let secret = lagrangeInterpolation(points);
    return { secret, points }; // Return secret and points for further processing
}

// Function to find wrong points that don't fit the polynomial
function findWrongPoints(points, secret) {
    let wrongPoints = [];

    for (const [x, y] of points) {
        // Check if the point lies on the curve represented by constant 'c'
        if (y !== secret) {
            wrongPoints.push({ x, y });
        }
    }

    return wrongPoints;
}

// Function to run the test cases and display results
async function runTestCases() {
    try {
        // Fetch input JSON files for test cases
        const response1 = await fetch('input1.json');
        const data1 = await response1.json();

        const response2 = await fetch('input2.json');
        const data2 = await response2.json();

        // Process first test case
        const { secret: secret1, points: points1 } = processInput(data1);

        // Process second test case
        const { secret: secret2, points: points2 } = processInput(data2);

        // Identify wrong points in the second test case
        const wrongPoints = findWrongPoints(points2, secret2);

        // Display the input JSON
        document.getElementById("inputJson").textContent = JSON.stringify(data2, null, 2);
        
        // Display the output
        let outputHtml = `Secret for Test Case 1: ${secret1}\n`;
        outputHtml += `Secret for Test Case 2: ${secret2}\n`;
        if (wrongPoints.length > 0) {
            outputHtml += `Wrong Points in Test Case 2:\n`;
            wrongPoints.forEach(point => {
                outputHtml += `Point (x: ${point.x}, y: ${point.y})\n`;
            });
        } else {
            outputHtml += `No wrong points in Test Case 2.\n`;
        }

        document.getElementById("outputResult").textContent = outputHtml;
    } catch (error) {
        console.error("Error fetching input JSON files:", error);
        document.getElementById("outputResult").textContent = "Error fetching input JSON files.";
    }
}

// Run the test cases
runTestCases();




