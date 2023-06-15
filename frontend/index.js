const submit = async () => {
  const input = document.getElementById('input').value;
  if (!input) return;

  const controller = new AbortController();
  const response = await fetch('http://localhost:4000/stream', {
    method: 'POST',
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ input })
  });

  if (!response.ok || !response.body) {
    const errorText = `[${response.status}] ${response.statusText}`;

    if (response.body) {
      const error = await response.text();
      console.error(`${errorText}\n\n${error}`);
    } else {
      console.error(errorText);
    }

    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    text += chunkValue;

    document.getElementById('response').innerHTML = text;
  }
}