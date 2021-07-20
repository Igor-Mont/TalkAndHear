const button = document.querySelector('.btnSpeak')
const text = document.querySelector('.text');
const btnHear = document.querySelector('.btnHear')
const clear = document.querySelector('.clear')
const p = document.querySelector('.toggle-text')

const recognition = createRecognition();

let listening = false;

button.addEventListener('click', () => {
  if(!recognition) return;

  listening ? recognition.stop() : recognition.start();

  p.innerHTML = listening ? 'Aperte para falar' : 'Parar de falar'
})

function createRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = SpeechRecognition !== undefined ? new SpeechRecognition() : null

  if(!recognition) {
    text.innerHTML = 'Speech is not found'
    return null
  }

  recognition.lang = "pt_BR"

  recognition.onstart = () => listening = true;
  recognition.onend = () => listening = false;
  recognition.onerror = e => console.log('error', e);
  recognition.onresult = e => text.innerHTML = e.results[0][0].transcript;

  return recognition
}

// API de voz
var synth = window.speechSynthesis;

var langSelect = document.querySelector('.talk-lang');

var voiceSelect = document.querySelector('.select');
var btnSpeak = document.querySelector('#speak');

// array de vozes/idioma
var voices = [];

// fn de seleção de vozes e colocar no options do select
function populateVoiceList() {
  voices = synth.getVoices()
  voices.forEach((v, i) => {
    let option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    if(voices[i].default) option.textContent += ' -- DEFAULT';

    option.setAttribute('data-lang', voices[i].lang)
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);

  })
}

populateVoiceList();


if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking SPEAKING');
        return;
    }

    if (text.innerHTML !== '') {
    var utterThis = new SpeechSynthesisUtterance(text.innerHTML);

    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend END');
    }

    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror ERROR');
    }

    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    voices.forEach((v, i) => {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    })
  
    synth.speak(utterThis);
  }
}

btnHear.addEventListener('click', (event) => {
  event.preventDefault();
  speak();
  text.blur();
})


voiceSelect.onchange = function(){
  speak();
}

clear.addEventListener('click', () => {
  text.innerHTML = ''
})