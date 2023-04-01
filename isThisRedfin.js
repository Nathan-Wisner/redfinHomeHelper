(async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    let result;
    try {
      [{result}] = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: () => document.documentElement.innerText,
      });
    } catch (e) {
      return;
    }
    // process the result
    document.body.textContent = result;
    // process the result
    const regex = /Style Code: (.*)/;
    const acreRegex = /Lot Size Acres: (.*)/;
    const styleMatch = regex.exec(result);
    const acreMatch = acreRegex.exec(result);
    if (styleMatch && acreMatch) {
        const styleCodeText = styleMatch[1];
        const acreText = acreMatch[1]
        var minAcres = Math.floor(getAcresFromStyle(acreText,styleCodeText))

        document.body.textContent = "You could build a maximum of " + minAcres + " homes on this lot";
    } else {
        console.log('Style Code not found');
    }

  })();

  function getAcresFromStyle(acreText, styleText){
    const regex = /^(\d+)/; // Match one or more digits at the beginning of the string
    const styleNumber = parseInt(styleText.match(regex));
    const acreNumber = Math.floor(parseInt(acreText.match(regex)))
    if (styleNumber == 40){
        return acreNumber/1
    }
    if (styleNumber == 41){
        return acreNumber/2
    }
    if (styleNumber == 42){
        return acreNumber/5
    }
    return acreNumber/10
  }

  // Style Code 40: - Res under 1 acre
  // Style Code 41 - Res-Over 1 Acre
  // Style Code 42: - Res over 5 Acre
  // Style Code 43: Industrial
  // Style Code 44 - Recreational