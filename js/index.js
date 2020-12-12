/**
 * Afzal Ali
* 9/27/2020
* iste-340-02 / Professor Goldman
* Project 1 - The Virtual Food App
 */

const choiceData = selectInfo.choices;
const dataLength = Object.keys(choiceData).length;
// localStorage.clear();

const imageData = images;

// get the max depth from data
const { depth: maxDepth } = choiceData.reduce((accumulator, currentValue) => {
    return currentValue.depth > accumulator.depth? currentValue : accumulator;
});

const selectDiv = document.createElement("div");
selectDiv.id ="selectDiv";
document.body.append(selectDiv);

let title = document.createElement('h1');
titleText = document.createTextNode("The Virtual Food App");
title.appendChild(titleText);
selectDiv.appendChild(title);

// if name in localstorage, then proceed to the selection page
// else show the form to the user so they can enter their name
if (localStorage.username) {
    showName();
    createSelectElement("Main");
}
else showForm();

// if no name in localstorage, display the form to the user
function showForm() {
    const form = document.createElement('form');
    let h2 = document.createElement('h2');
    let nameText = document.createTextNode('Enter Your Name');
    h2.appendChild(nameText);

    let nameInput = document.createElement('input');
    nameInput.placeholder = "Your name";

    let button = document.createElement('button');
    button.type = 'submit';
    let buttonText = document.createTextNode('Submit');
    button.id = "submitButton";
    button.appendChild(buttonText);
    
    let description = document.createElement('p');
    description.id="description";
    let descriptionText = document.createTextNode('The Virtual Food App will serve you a virtual dish to your liking. Enter your name to begin!');
    description.appendChild(descriptionText);

    form.appendChild(description);
    form.appendChild(h2);
    form.appendChild(nameInput);
    form.appendChild(button);

    selectDiv.appendChild(form);

    // once the user submits the form, validate and save their name into localstorage
    function onSubmit(event) {
        event.preventDefault();
        let name = nameInput.value;

        // form validation
        if (name) {
            localStorage.username = name;
            form.remove();
            showName();
            createSelectElement("Main");
        } 
        else if(!document.getElementById('errorMessage')) { 
            let errorMessage = document.createElement('div');
            errorMessage.id = "errorMessage";
            errorMessageText = document.createTextNode('You must enter your name!');
            errorMessage.appendChild(errorMessageText);
            form.appendChild(errorMessage);

            nameInput.style.borderColor = 'red';
        }
    }
    
    form.addEventListener('submit', event => {
        onSubmit(event);
    })
}

function showName() {
    let nameElement = document.createElement('h3');
    nameElement.id = "name";
    nameText = document.createTextNode(`Hi ${localStorage.username},`);
    nameElement.appendChild(nameText);
    selectDiv.appendChild(nameElement);
}

function createSelectElement(dataKey) {

    for (var i = 0; i < dataLength; i++) {

        // If choice does not match key, skip this data point
        if (choiceData[i].key != dataKey)
            continue;

        // Creates a header to label the specific select menu
        var h2 = document.createElement('h2');
        var textNode = document.createTextNode(choiceData[i].description);
        h2.className = choiceData[i].depth;
        h2.appendChild(textNode);
        selectDiv.appendChild(h2);

        // Creates the select list element
        var selectList = document.createElement('select');
        selectList.id = choiceData[i].key;
        selectList.name = choiceData[i].description;
        selectList.className = choiceData[i].depth;
        selectDiv.appendChild(selectList);

        // Creates null Select option
        var nullOption = document.createElement('option');
        nullOption.text = "Select an Option";
        nullOption.selected = this;
        nullOption.disabled = true;
        selectList.appendChild(nullOption);                

        // Creates option 1
        var newOption1 = document.createElement('option');
        newOption1.value = choiceData[i].option_1;
        newOption1.text = choiceData[i].option_1;
        selectList.appendChild(newOption1);

        // Creates option 2
        var newOption2 = document.createElement('option');
        newOption2.value = choiceData[i].option_2;
        newOption2.text = choiceData[i].option_2;
        selectList.appendChild(newOption2);

        // Hooks up an event to reload the choices whenever the select value is changed
        //selectList.onchange
        selectList.addEventListener("change", () => {
            currentSelection = selectList.value;

            // call a function to remove select lists if necessary
            removeSelect(selectList)
            
            // call a function to add new select list
            createSelectElement(currentSelection);

            // get the depth of the current selection 
            let depth = null;

            choiceData.forEach(element => {
                if (element.key == selectList.value) {
                    depth = element.depth;
                }
            });

            let output = document.querySelector('#output');
            if (output) output.remove(); // if existing output element node exists, remove it

            // if selection is complete
            if (!depth) {
                onFinishSelection();
            }
        });
    }
};

// when user finishes selection, display the output
function onFinishSelection() {
    let selectAll = Array.from(document.querySelectorAll('select'));

    let values = selectAll.map(({ value }) => value);

    output = document.createElement('div');
    output.id = "output";

    let hr = document.createElement('hr');

    let p1 = document.createElement('p');
    let p2 = document.createElement('p');
    let p1Text = document.createTextNode(`You are a ${values[0]}, like to consume ${values[1]}, and your favorite dish is ${values[2]}.`);
    let p2Text = document.createTextNode(`Here is your virtual ${values[2]} dish:`);

    p1.appendChild(p1Text);
    p2.appendChild(p2Text);

    let image = imageData[values[(values.length - 1)]];

    let imageElement = document.createElement("img");
    imageElement.src = image;
    imageElement.id = "outputImage";

    let resetSelectionButton = document.createElement('button');
    resetSelectionButton.className = "resetButton";
    let resetSelectionText = document.createTextNode('Reset Selection');
    resetSelectionButton.appendChild(resetSelectionText);

    let resetNameButton = document.createElement('button');
    resetNameButton.className = "resetButton";
    let resetNameText = document.createTextNode('Reset Name');
    resetNameButton.appendChild(resetNameText);

    // when user clicks the reset selection button, reset the selection
    function onClickResetSelection() {
        let h3 = document.querySelector('h3');
        
        while (h3.nextSibling) {
            h3.nextSibling.remove();
        }

        createSelectElement("Main");
    }

    // when user clicks the reset selection button, reset everything and show form page
    function onClickResetName() {
        localStorage.clear();

        let h1 = document.querySelector('h1');
        
        while (h1.nextSibling) {
            h1.nextSibling.remove();
        }
        
        showForm();
    }

    resetSelectionButton.addEventListener('click', onClickResetSelection);
    resetNameButton.addEventListener('click', onClickResetName);

    output.appendChild(hr);
    output.appendChild(p1);
    output.appendChild(p2);
    output.appendChild(imageElement);
    output.appendChild(resetSelectionButton);
    output.appendChild(resetNameButton);
    selectDiv.appendChild(output)
}

// check to see if a select list needs to be removed after a user changes a selection
function removeSelect(selectList) {
    
    // checks if a select list already exists in the dom. If it does, then it removes it from the node
    function removeElements(depth) {
        const elements = document.getElementsByClassName(parseInt(depth));
        if (elements.length) Array.from(elements).forEach(element => element.remove());
    }

    // get the depth of the current selection 
    choiceData.forEach(element => {
        if (element.key == selectList.value) {
            const { depth } = element;

            for(let i=0; i<(maxDepth - (depth - 1)); i++) {
                removeElements(depth + i);
            }
        }
    });
}