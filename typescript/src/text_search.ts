const searchBox = document.getElementById("searchbox") as HTMLInputElement
if (!searchBox){
    console.error("NO BOX")
}
const resultsBox = document.getElementById("searchresultsbox") as HTMLParagraphElement
if (!resultsBox){
    console.error("NO RESULTS BOX")
}
searchBox?.addEventListener("input", () => search(searchBox.value))

function search(word: string){
    const blogs = document.getElementById("blogs")
    if (!blogs || !word) {
        return
    }

    // Replace <br>s with \ns and get text
    let html = blogs.innerHTML.replace(/<br>/g, "\n\n")
    let tempElement = document.createElement("div")
    tempElement.innerHTML = html
    let content = tempElement.textContent

    if (!content) return

    let caseSensitive = false
    let toSearch = word

    let references = showReferences(toSearch, content, caseSensitive)
    resultsBox.innerText = references
}

function showReferences(toSearch: string, content: string, caseSensitive: boolean){
    const padding = 50
    let originalContent = content
    if (!caseSensitive){
        content = content.toLowerCase()
        toSearch = toSearch.toLowerCase()
    }
    let idx = content.indexOf(toSearch)
    if (idx == -1) return ""
    let l = Math.max(idx - padding, 0)
    let r = Math.min(idx + padding, content.length - 1)
    
    // Stop at newlines
    let nextNewlinePos = content.indexOf("\n", idx)
    if (nextNewlinePos > idx){
        r = Math.min(r, nextNewlinePos - 1)
    }

    let lastNewlinePos = content.substring(0, idx).lastIndexOf("\n")
    if (lastNewlinePos > l) {
        l = Math.max(l, lastNewlinePos + 1)
    }

    let out = originalContent.substring(l, r)
    return "..." + out + "..."
}