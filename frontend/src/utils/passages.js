export const passages=[
"The abandoned terminal waited silently beneath a layer of dust. A single cursor blinked on the screen, asking for a trace from anyone brave enough to type.",
"Rain pressed against the laboratory windows while old monitors hummed in the dark. Somewhere in the archive, a forgotten machine was still recording every keystroke.",
"Beyond the locked hallway, a small green light marked the entrance to the archive. The system was quiet, but the cursor moved as if someone unseen were already typing.",
"Technology leaves strange fingerprints. Every command, pause, mistake, and correction becomes part of a history that can reveal how a person works under pressure.",
"The stars looked close enough to touch from the observatory roof. Inside, a terminal displayed a message that had not been written by any researcher on the night shift.",
"An explorer carried a worn notebook through the forest, following marks that appeared only after sunset. The final page contained a sentence typed in perfect rhythm.",
"The archive contained thousands of records, but one file had no author. It opened itself whenever a visitor made three mistakes in a row.",
"Good typing is not only speed. It is rhythm, accuracy, attention, and the ability to recover from a mistake without losing the flow of the sentence.",
"At midnight the old console restarted by itself. Its screen showed a timer, a blinking cursor, and a simple instruction: begin the trace.",
"Every difficult task becomes easier when progress is measured. A small improvement repeated every day can eventually become a personal record.",
"Deep space is silent, but instruments continue to listen. Signals arrive as patterns, and patient observers learn to separate meaningful traces from noise.",
"The museum guard noticed a keyboard glowing inside a sealed exhibit. The display showed yesterday's typing score, even though the computer had been unplugged for years.",
"An engineer checks assumptions before trusting a system. Clear measurements, careful tests, and useful feedback turn uncertain ideas into dependable results.",
"The hallway lights flickered once, then stabilized. On the terminal, a new line appeared: your fastest self has returned.",
"Memory is an archive of patterns. The more deliberately you practice, the easier it becomes to recognize errors and choose a better response.",
"Fog covered the road as the signal tower came into view. Its receiver was active, and a quiet terminal nearby displayed a challenge with no visible author.",
"Some machines are built to calculate, others to observe. This one seemed to remember. Each completed trace became another entry in its growing archive.",
"Speed without accuracy creates noise. Accuracy without rhythm creates hesitation. Strong performance comes from finding a steady balance between both.",
"The final room contained only a desk, an old monitor, and a chair facing the wall. The monitor displayed one question: can you beat your previous trace?",
"An empty terminal is not necessarily inactive. Sometimes the most important signal is the one waiting for a person to press the first key."
]
export function randomPassage(previous=""){let pool=passages.filter(x=>x!==previous);return pool[Math.floor(Math.random()*pool.length)]}
