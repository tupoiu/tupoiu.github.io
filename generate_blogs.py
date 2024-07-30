import os
import re

# Get all markdown files in the blogs folder,
# ignoring those which start with underscore.
blogs = []
blog_paths = [path for path in os.listdir("blogs") 
              if path.endswith(".md") 
              and not path.startswith("_")]

# Start with the latest blog
blog_paths = list(reversed(blog_paths))

for blog_path in blog_paths:
    content = open(f"blogs/{blog_path}").read()
    blogs.append(content)

template = open("blog_template.html").read()

# Replace markdown with HTML tags
def compile_markdown(markdown: str):
    out = markdown
    out = re.sub("### (.+?)\n", r"<h4>\1</h4>", out)
    out = re.sub("## (.+?)\n", r"<h3>\1</h3>", out)
    out = re.sub("https://(.+?)(\s)", r"<a href='https://\1'>https://\1</a>\2", out)
    out = re.sub(r"\n", r"<br>", out)
    out = re.sub(r"```(.*?)```",
                  lambda match:
                    "```" + re.sub(r"<br>", r"\n", match.group(1)) + "```",
                      out, flags=re.DOTALL)
    out = re.sub(r"```hs\n(.*?)```", r"<pre><code class='language-haskell'>\1</code></pre>", out, flags=re.DOTALL)
    out = re.sub(r"```(.*?)```", r"<code>\1</code>", out, flags=re.DOTALL)
    return out

# Inline testing!!!
assert compile_markdown("```hello```") == "<code>hello</code>"
assert compile_markdown("## Title\n") == "<h3>Title</h3>"
assert compile_markdown("### Subtitle\n") == "<h4>Subtitle</h4>"

blogs = map(compile_markdown, blogs)

# Create the contents page at the top of the
# blog which links to each blog on the page
blog_contents = map(lambda name: f"<a href='#{name}'>- {name}</a>", blog_paths)
blogs_with_anchors = [f"<a name='{name}'></a>{blog}"
                       for (name, blog) in zip(blog_paths, blogs)]

blog_html = template.replace("###BLOGS###", "\n<hr>\n".join(blogs_with_anchors))
blog_html = blog_html.replace("###BLOG-CONTENTS###", "<br>".join(blog_contents))

open("blogs.html", "w").write(blog_html)
