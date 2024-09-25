// Loader
const LoaderDiv = document.getElementById("loader");
const OutputText = document.getElementById('outputText')

function showLoader() {
  // Wine glass animation
  var svgMorpheus = new SVGMorpheus(".loader");
  var icons = ["step1", "step2"];
  var current = 0;

  function changeIcon() {
    setTimeout(function () {
      svgMorpheus.to(icons[current++ % 2], { rotation: "none", duration: 800 });
      changeIcon();
    }, 800);
  }
  // --Wine glass animation

  // Hide placeholder text
  OutputText.classList.add('hide')
  // --Hide placeholder text

  LoaderDiv.classList.add("show");
  changeIcon();
}

function hideLoader() {
  LoaderDiv.classList.remove("show");
  OutputText.classList.remove('hide')
}

//--Loader

// Button
const SubmitButton = document.getElementById("submit_button");

function disabledButton() {
  SubmitButton.classList.add("disabled");
  SubmitButton.disabled = true;
}

function activeButton() {
  SubmitButton.classList.remove("disabled");
  SubmitButton.disabled = false;
}
//--Button

const sommelierForm = document.getElementById("sommelier_form");
sommelierForm.addEventListener("submit", formSubmit);

async function formSubmit(event) {
  disabledButton();
  showLoader();

  event.preventDefault();
  const dishIngredients = document.getElementById("form-ingredients").value;
  const dishDescription = document.getElementById("form-dish").value;

  const response = await fetch(
    "https://sommelierapi.onrender.com/recommendation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dishIngredients, dishDescription }),
    }
  );

  const data = await response.json();

  hideLoader();
  activeButton();
  OutputText.classList.add('bright_text')


  OutputText.textContent = data.recommendation;
}
