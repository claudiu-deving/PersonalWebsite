window.addEventListener('load', function() {
    resizeElements(); 
  });
window.addEventListener('resize', function() {
    resizeElements(); 
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
  