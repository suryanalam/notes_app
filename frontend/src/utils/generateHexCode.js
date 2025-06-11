function generateHexCode() {
    const part = () => Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
    return `${part()}-${part()}-${part()}-${part()}`;
}

export default generateHexCode;
