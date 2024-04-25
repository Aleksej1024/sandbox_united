const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();

app.use(cors())
app.use(express.json());

const writeFilePromise = promisify(fs.writeFile);
const execPromise = promisify(exec);

app.post('/', async (req, res) => {
    const { language, code, arguments, date } = req.body;
    let language_r = "";
    let language_e = "";
    let progName = "";
    let testName = "";

    switch (language) {
        case 'javascript':
            language_r = "js";
            language_e = "node";
            break;
        case 'cpp':
            language_r = "cpp";
            language_e = "";
            break;
        case 'python':
            language_r = "py";
            language_e = "python3";
            break;
        default:
            return res.status(400).send('Invalid language');
    }

    testName = `./tests/test_${language}_${date}.txt`;
    try {
        await writeFilePromise(testName, arguments);

        progName = `./tests/script_${language}_${date}.${language_r}`;
        await writeFilePromise(progName, code);

        if (language_r === "cpp") {
            const compileCommand = `g++ -o ${progName.slice(0,-4)} ${progName}`;

            try {
                const { stdout: compileStdout, stderr: compileStderr } = await execPromise(compileCommand);

                console.log(compileStdout);
                console.error(compileStderr);

                const runCommand = `${language_e} ${progName.slice(0,-4)} < ${testName}`;
                const { stdout: runStdout, stderr: runStderr } = await execPromise(runCommand);

                console.log(runStdout);
                console.error(runStderr);

                const result = runStdout; // Сохранение результата выполнения в переменную
                res.send(result); // Отправка результата выполнения в качестве ответа
            } catch (error) {
                console.error(error);
                return res.send(`Error running script ${error}`);
            }
        } else {
            const runCommand = `(${language_e} ${progName}) < ${testName}`;
            const { stdout: runStdout, stderr: runStderr } = await execPromise(runCommand);

            console.log(runStdout);
            console.error(runStderr);

            const result = runStdout; // Сохранение результата выполнения в переменную
            res.send(result); // Отправка результата выполнения в качестве ответа
        }
    } catch (error) {
        console.error(error);
        return res.send(`Error in user input`);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
