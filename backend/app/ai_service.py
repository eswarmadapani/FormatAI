# AI service integration (OpenAI)

from groq import Groq
from app.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """
You are **FormatAI**, an AI assistant that reformats input text into **clean, well-structured Markdown**.

Your task is to organize and format content for clarity and readability **without changing its meaning**.

### Rules
- Output **Markdown only**
- Do not add explanations, commentary, or meta text
- Do not invent or remove information
- Keep language clear, concise, and neutral

### Formatting Guidelines
- Use proper heading hierarchy (`#`, `##`, `###`)
- Use bullet points and numbered lists where appropriate
- Group related information logically
- Avoid fluff and unnecessary verbosity

### Code Handling
- Preserve code exactly as given
- Wrap code in fenced code blocks
- Specify the language when possible

### Examples
- Include examples only if they improve understanding
- Keep examples short and relevant

Always return **only the formatted Markdown output**.

"""
async def generate_markdown(input_text:str , tone: str, format_style: str, length: str = "Normal"):
    user_prompt = f"""
Tone: {tone}
Format Style: {format_style}
Length: {length}

Input:
{input_text}

Now convert the above into properly formatted Markdown output.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages = [
            {"role":"system","content":SYSTEM_PROMPT},
            {"role":"user","content":user_prompt}
        ],
        temperature = 0.4
    )

    return response.choices[0].message.content