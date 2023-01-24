const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

let storyText = 'It was 94 fahrenheit outside, so :insertx: went for a walk. \
When they got to :inserty:, they stared in horror for a few moments, then \
:insertz:. Bob saw the whole thing, but was not surprised — :insertx: \
weighs 300 pounds, and it was a hot day.';

let insertX = [
    'Willy the Goblin',
    'Big Daddy',
    'Father Christmas'
];

let insertY = [
    'the soup kitchen',
    'Disneyland',
    'the White House'
];

let insertZ = [
    'spontaneously combusted',
    'melted into a puddle on the sidewalk',
    'turned into a slug and crawled away'
];

function randomValueFromArray(array) {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
}

randomize.addEventListener('click', result);

function result() {

    let xItem;
    let yItem;
    let zItem;
    let newStory;
    xItem = randomValueFromArray(insertX);
    yItem = randomValueFromArray(insertY);
    zItem = randomValueFromArray(insertZ);
    newStory = storyText.replace(/:insertx:/, xItem);
    newStory = newStory.replace(/:inserty:/, yItem);
    newStory = newStory.replace(/:insertz:/, zItem);
    
    if (customName.value !== '') {
        const name = customName.value;
        newStory = newStory.replace(/Bob/, name)

    }

    if (document.getElementById("uk").checked) {
        const weight = Math.round(300);
        const temperature = Math.round(94);

    }

    story.textContent = newStory;
    story.style.visibility = 'visible';
}