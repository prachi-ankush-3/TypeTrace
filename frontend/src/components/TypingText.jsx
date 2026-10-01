export default function TypingText({ text, typed }) {
  return (
    <div className="typing-text" aria-label="Typing passage">
      {[...text].map((ch, i) => {
        const typedChar = typed[i];

        let cls = "pending";
        if (i === typed.length) cls = "current";
        else if (typedChar === undefined) cls = "pending";
        else if (typedChar === ch) cls = "correct";
        else cls = "wrong";

        return (
          <span className={cls} key={`${i}-${ch}`}>
            {ch === "\n" ? <br /> : ch}
          </span>
        );
      })}
      <span className="sr-only">{typed}</span>
    </div>
  );
}
