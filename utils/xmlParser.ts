export default function xmlToJson(xml: string): Record<string, unknown> | null {
    // Remove XML declaration if present
    xml = xml.trim().replace(/^<\?xml.*?\?>\s*/, '');

    function parseNode(xmlStr: string): Record<string, unknown> | null {
        const tagMatch = xmlStr.match(/^<([^\/>]+)>/);
        if (!tagMatch) return null;

        const tagName = tagMatch[1];
        const closingTag = `</${tagName}>`;
        const closingTagIndex = xmlStr.indexOf(closingTag);

        if (closingTagIndex === -1) return null;

        const innerXml = xmlStr.substring(tagMatch[0].length, closingTagIndex);
        const nodeObj: Record<string, unknown> = {};

        // Parse attributes
        const attrMatch = tagName.match(/(\S+)\s+(.*)/);
        if (attrMatch) {
            const attrTagName = attrMatch[1];
            const attrString = attrMatch[2];
            nodeObj[attrTagName] = parseAttributes(attrString);
        }

        // Parse children or text content
        const content = parseInnerContent(innerXml);
        if (typeof content === 'string') {
            nodeObj['#text'] = content;
        } else {
            Object.assign(nodeObj, content);
        }

        return { [tagName]: nodeObj };
    }

    function parseAttributes(attrString: string): Record<string, string> {
        const attributes: Record<string, string> = {};
        const attrRegex = /(\S+)=["'](.*?)["']/g;
        let match;

        while ((match = attrRegex.exec(attrString)) !== null) {
            attributes[`@${match[1]}`] = match[2];
        }

        return attributes;
    }

    function parseInnerContent(innerXml: string): Record<string, unknown> | string {
        const contentObj: Record<string, unknown> = {};
        const tagRegex = /<([^\/>]+)>(.*?)<\/\1>/g;
        let match;
        let isTextOnly = true;

        while ((match = tagRegex.exec(innerXml)) !== null) {
            isTextOnly = false;
            const tagName = match[1];
            const tagContent = match[2].trim();

            const childNode = parseNode(`<${tagName}>${tagContent}</${tagName}>`);

            if (childNode !== null) {
                if (contentObj[tagName]) {
                    if (!Array.isArray(contentObj[tagName])) {
                        contentObj[tagName] = [contentObj[tagName]];
                    }
                    (contentObj[tagName] as Array<unknown>).push(childNode[tagName]);
                } else {
                    contentObj[tagName] = childNode[tagName];
                }
            }
        }

        return isTextOnly ? innerXml.trim() : contentObj;
    }

    return parseNode(xml);
}
