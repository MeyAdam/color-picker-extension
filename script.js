// get color picker btn
const colorPickerBtn = document.querySelector('#color-picker');

// get ul element
const colorList = document.querySelector(".all-colors");

// get span clear all
const clearAll = document.querySelector(".clear-all");

//// store picked colors to local storage and show them in pickedColors
// picked colors array
// getting the chosen colors from local storage or an empty array
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

const copyColor = elem => {
  navigator.clipboard.writeText(elem.dataset.color);
  elem.innerText = "Copied";
  setTimeout(() => elem.innerText = elem.dataset.color, 1000);
}

// show color values in localStorage at li
const showColors = () => {
  if (!pickedColors.length) return; // returning if there are no picked colors
  colorList.innerHTML = pickedColors.map(color => `
    <li class="color">
      <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
      <span class="value" data-color="${color}">${color}</span>
    </li>
  `).join(""); // generating li for the picked color and adding it to the colorList
  // explaination of ${color == "#ffffff" ? "#ccc" : color}. if the picked color is white, add gray border, else add the picked color border
  document.querySelector(".picked-colors").classList.remove("hide");

  // copy colors on click
  document.querySelectorAll(".color").forEach(li => {
    // add a click event listener to each color element to copy the color code
    li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild));
  });
}
showColors();

const activateEyeDropper = () => {
  // hide extension popup when eye dropper is active
  document.body.style.display = "none";
  // use async await, so write code inside try catch block for error handling
  setTimeout(async () => {
    try {
      // creating a new eye dropper object. used to select colors from the screen
      // opening the eye dropper
      const eyeDropper = new EyeDropper();
      // getting the selected color from eye dropper
      const { sRGBHex } = await eyeDropper.open();
      // copying the selected color to the clipboard
      navigator.clipboard.writeText(sRGBHex);
  
      // adding the color to the list if it doesn't already exist
      if (!pickedColors.includes(sRGBHex)) {
        // adding picked colors to the pickedColors array
        pickedColors.push(sRGBHex);
        // picked-colors is the name of the item and second is the value
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        showColors();
      }
    } catch (error) {
      console.log("Failed to copy the color code!");
    }
    document.body.style.display = "block";
  }, 10);
}

// clearing all picked colors, updating localStorage and hiding pickedColors element
const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
}

clearAll.addEventListener("click", clearAllColors);

// show eye dropper on the button click
colorPickerBtn.addEventListener("click", activateEyeDropper);