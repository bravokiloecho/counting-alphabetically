import humanize from './humanize.js';
import { generateArray, getNodeIndex } from './utils.js';

// GET NUMBERS
const totalNumbers = 1000;
// eslint-disable-next-line
const numbersArray = generateArray(totalNumbers)
  .map((e, index) => humanize(index))
  .sort();

// WRITE NUMBERS
const textEl = document.getElementById('text');
const setText = (text) => {
  textEl.textContent = text;
};

// SCROLLING LIST
const scroller = document.getElementById('scroller');
const setupScroller = () => {
  let i = 0;
  let innerHtml = '';
  for (i; i < numbersArray.length; i += 1) {
    const item = `<li><a role="button">${numbersArray[i]}</a></li>`;
    innerHtml = `${innerHtml}${item}`;
  }
  scroller.innerHTML = innerHtml;
};

const highlightScrollingNumber = (index) => {
  const activeClass = 'active';
  const numbers = scroller.children;
  // Clear all active classes
  [].forEach.call(numbers, (el) => {
    el.classList.remove(activeClass);
  });
  // Add active class
  const activeNumber = numbers[index];
  activeNumber.classList.add(activeClass);
  // Scroll to active number
  const { height: scrollerHeight } = scroller.getBoundingClientRect();
  const { height: numberHeight, top: numberTop } = activeNumber.getBoundingClientRect();
  const { offsetTop } = activeNumber;
  if ((numberTop + numberHeight) > scrollerHeight) {
    scroller.scrollTo(0, offsetTop + numberHeight - scrollerHeight);
  }
};

// SPEAK
const synth = window.speechSynthesis;
const voices = synth.getVoices();
const voiceIndex = Math.floor(Math.random() * voices.length);
const speakText = (text, pitch, spokenNumberIndex) => {
  if (!synth) return;
  synth.cancel();
  return new Promise((resolve) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.onend = () => resolve({ spokenNumberIndex });
    msg.voice = voices[voiceIndex];
    msg.volume = 1; // From 0 to 1
    msg.rate = 1; // From 0.1 to 10
    msg.pitch = pitch; // From 0 to 2
    msg.text = text;
    msg.lang = 'en';
    synth.speak(msg);
  });
};

// RUN
const delay = 800;
const initialPitch = 0.1;

const state = {
  index: 0,
  pitch: initialPitch,
  timer: null,
  paused: false,
};

const runNumber = async (forceIndex) => {
  if (state.paused) return;
  // Update index, if forced
  if (typeof forceIndex === 'number') state.index = forceIndex;
  // Get number
  const number = numbersArray[state.index];
  // Stop here at end
  if (!number) return;
  // UPDATE UI
  highlightScrollingNumber(state.index);
  // WRITE
  setText(number);
  // SPEAK
  state.pitch += 0.07;
  if (state.pitch >= 2) state.pitch = initialPitch;
  const { spokenNumberIndex } = await speakText(number, state.pitch, state.index);
  // Stop here if not the same number
  if (spokenNumberIndex !== state.index) return;
  // Update index
  state.index += 1;
  // Run again
  state.timer = setTimeout(runNumber, delay);
};

// * UI
// ----------------

// Mobile scroller button
const setupMobileScroller = () => {
  const button = document.getElementById('scroller-button');
  button.classList.add('-ready');
  const toggleScroller = () => {
    console.log('sdfsd')
    scroller.classList.toggle('-show');
  };
  button.addEventListener('click', toggleScroller, { passive: true });
};

// Scroll clicks
const setupClickScrollingNumber = () => {
  const onClick = (e) => {
    const { target, target: { nodeName } } = e;
    if (nodeName !== 'A') return;
    const index = getNodeIndex(target.parentElement);
    synth.pause();
    clearTimeout(state.timer);
    runNumber(index);
  };
  scroller.addEventListener('click', onClick, { passive: true });
};

// PAUSE/UNPAUSE
const togglePause = () => {
  const resume = state.paused;
  state.paused = !resume;
  if (resume) {
    // Update index
    state.index += 1;
    // Start again
    runNumber();
    return;
  }
  synth.cancel();
  clearTimeout(state.timer);
};

// START
const container = document.getElementById('container');
const start = async () => {
  setupScroller();
  runNumber();
  setupClickScrollingNumber();
  setupMobileScroller();
  container.addEventListener('click', togglePause, { passive: true });
};

container.addEventListener('click', start, { passive: true, once: true });
