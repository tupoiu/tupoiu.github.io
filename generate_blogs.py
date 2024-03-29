import os
import re

blogs = []
blog_paths = os.listdir("blogs")
for blog_path in blog_paths:
    if blog_path.endswith(".md"):
        with open(f"blogs/{blog_path}") as file:
            content = file.read()
            blogs.append(content)

template = open("blog_template.html").read()

def compile_markdown(markdown: str):
    out = markdown
    out = re.sub("## (.+?)\n", r"<h3>\1</h3>", out)
    out = re.sub(r"\n", r"<br>", out)
    out = re.sub(r"```(.*?)```",
                  lambda match:
                    "```" + re.sub(r"<br>", r"\n", match.group(1)) + "```",
                      out, flags=re.DOTALL)
    out = re.sub(r"```hs\n(.*?)```", r"<pre><code class='language-haskell'>\1</code></pre>", out, flags=re.DOTALL)
    out = re.sub(r"```(.*?)```", r"<code>\1</code>", out, flags=re.DOTALL)
    # 
    return out

# Inline testing!!!
assert compile_markdown("```hello```") == "<code>hello</code>"

blogs = map(compile_markdown, blogs)

blog_html = template.replace("###BLOGS###", "\n".join(blogs))

open("blogs.html", "w").write(blog_html)
