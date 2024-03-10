import openai

def query_openai_gpt(prompt):
    openai.api_key = 'my super secret key'

    response = openai.Completion.create(
      engine="davinci",
      prompt=prompt,
      max_tokens=150
    )

    return response.choices[0].text.strip()

# Example usage
prompt = "What are the benefits of artificial intelligence?"
print(query_openai_gpt(prompt))
