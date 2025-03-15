const copyToClipboard = async (text) => {
  const isCopied = await navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
      return true;
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
      return false;
    });

  return isCopied;
};

export default copyToClipboard;
