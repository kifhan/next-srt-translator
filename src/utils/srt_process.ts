import { OpenAIStream } from "./OpenAI";

const MAX_RETRY = 3;

export function splitText(text: string) {
    // Use regular expression to match each block of subtitles in the input text (including empty line)
    const blocks = text.split(/(\n\s*\n)/);

    // Initialize the list of short texts
    let shortTextList = [];
    // Initialize the current short text
    let shortText = "";
    // Iterate over the list of subtitle blocks
    blocks.forEach(block => {
        // If the length of the current short text plus the new subtitle block does not exceed 1024, add the new subtitle block to the current short text
        if (shortText.length + block.length <= 1024) {
            shortText += block;
        }
        // If the length of the current short text plus the new subtitle block exceeds 1024, add the current short text to the list of short texts and reset the current short text to the new subtitle block
        else {
            shortTextList.push(shortText);
            shortText = block;
        }
    });
    // Add the last short text to the list of short texts
    shortTextList.push(shortText);

    return shortTextList;
}

export function isTranslationValid(originalText: string, translatedText: string) {
    function getIndexLines(text: string): [string[], number] {
        const lines = text.split('\n');
        const indexLines = lines.map(line => 
            line.replaceAll(" ","").replaceAll("\t","") // Remove all spaces and tabs
        ).filter(line => /^\d+$/.test(line.trim()));
        return [indexLines, indexLines.length];
    }

    const [originalIndexLines, originalLineLen] = getIndexLines(originalText);
    const [translatedIndexLines, translateLineLen] = getIndexLines(translatedText);

    // Log the texts and index lines for debugging (equivalent to print statements in Python)
    console.log(originalText);
    console.log(translatedText);
    console.log(originalIndexLines);
    console.log(translatedIndexLines);

    return originalIndexLines.join(',') === translatedIndexLines.join(',');
}


export async function translateText(text: string, languageName: string, skipError: boolean = true, maxRetries: number = MAX_RETRY) {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            // Simulate calling a translation API
            // Replace this with your actual API call and response handling
            let content = await OpenAIStream({
                messages: [
                    { role: 'user', content: `Translate the following subtitle text into ${languageName}, but keep the subtitle number and timeline unchanged, with result only:` },
                    { role: 'user', content: text },
                    { role: 'assistant', content: `Subtitle translation into ${languageName} is as follows:` }
                ]
            });
            // let tText = new TextDecoder("utf-8").decode(content);
            let tText = content;

            if (isTranslationValid(text, tText)) {
                return tText;
            } else {
                retries++;
                console.log(`Invalid translation format. Retrying (${retries}/${maxRetries})`);
            }
        } catch (e) {
            let sleepTime = 5000; // Sleep for 5 seconds
            await new Promise(resolve => setTimeout(resolve, sleepTime));
            retries++;
            console.log(`${e}, will sleep for ${sleepTime / 1000} seconds, Retrying (${retries}/${maxRetries})`);
        }
    }

    if (skipError) {
        console.log(`Unable to get a valid translation after ${maxRetries} retries. Returning the original text.`);
        return text;
    }
    throw new Error(`Unable to get a valid translation after ${maxRetries} retries.`);
}

export function replaceText(text1: string, text2: string) {
    function splitBlocks(text: string) {
        const blocks = text.trim().split(/(\n\s*\n)/);
        return blocks.filter(block => block.trim()).map(block => block.split('\n'));
    }

    const blocks1 = splitBlocks(text1);
    const blocks2 = splitBlocks(text2);

    let replacedLines = [];

    for (let i = 0; i < blocks1.length && i < blocks2.length; i++) {
        const block1 = blocks1[i];
        const block2 = blocks2[i];

        // Add index and timestamp from the first text
        replacedLines.push(block1[0], block1[1]);

        // Add content from the second text
        replacedLines.push(...block2.slice(2));

        // Add an empty line for separation
        replacedLines.push('');
    }

    return replacedLines.join('\n').trim();
}

