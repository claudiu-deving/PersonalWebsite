window.addEventListener('load', function() {
    resizeElements(); 
    resizeLogo();

  });
window.addEventListener('resize', function() {
    resizeElements(); 
    resizeLogo();
});

function resizeElements() { 
    let height=0;
    setTimeout(function() {
    const left = document.querySelector('#leftcarve'); 
    const right = document.querySelector('#rightcarve'); 
  
    if(!left && !right){
        return;
    }
    height = left.parentElement.offsetHeight; 
            if (height > 0) {
                left.style.borderRadius = ` ${height}px ${height}px 0 0`;
                right.style.borderRadius = ` 0 0 ${height}px ${height}px`;
            }
        }, 5); 
}
  

window.setCarvesRadiuses = function resizeElements() { 
    setTimeout(function() {
    const left = document.querySelector('#leftcarve'); 
    const right = document.querySelector('#rightcarve'); 
    const height = left.parentElement.offsetHeight; 
        if (height > 0) {
            left.style.borderRadius = ` ${height}px ${height}px 0 0`;
            right.style.borderRadius = ` 0 0 ${height}px ${height}px`;
        }
    }, 5); 
}

function resizeLogo() {
    const componentVarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--component-var-height'));
    let height= vhToPx(componentVarHeight);
    // Calculate the rounded value
    const roundedValue = replaceLastDigit(height);

    // Set the new value to the CSS variable --component-border-size
    document.documentElement.style.setProperty('--component-border-size', roundedValue + 'px');
}
function vhToPx(vh) {
    const height = window.innerHeight; // Get the viewport height in pixels
    return vh * height / 100; // Calculate the px value from vh
}

function replaceLastDigit(num) {
    const rounded = Math.round(num * 10) / 10;
    // Convert to string
    let str = rounded.toFixed(1); 

    // Replace last digit with 0
    str = str.substring(0, str.length - 1) + '0';

    return str;
}