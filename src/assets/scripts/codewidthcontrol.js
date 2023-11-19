document.addEventListener('DOMContentLoaded', (event) => {
    // Function to scale the 'pre' element within '.code'
    const originalWidth = document.body.offsetWidth;
    const scalePreElement = () => {
      // Get the current viewport width
      const viewportWidth = window.innerWidth;
      // Get the original viewport width when the document was loaded
     
  
      // Calculate the scale factor
      const scaleFactor = viewportWidth / originalWidth;
  
      // Get all 'pre' elements within elements with the class 'code'
      const preElements = document.querySelectorAll('.code pre');
  
      // Apply the scale transformation to each 'pre' element
      preElements.forEach(el => {
        el.style.transform = `scale(${scaleFactor})`;
        // Update transform origin
        el.style.transformOrigin = 'top left';
      });
  
      // Adjust the min-width of the '.code' div based on its 'pre' element
      preElements.forEach(pre => {
        const parentDiv = pre.closest('.code');
        if (parentDiv) {
          // Ensure the div has the minimum width required by the 'pre' element
          parentDiv.style.Width = `${pre.scrollWidth}px`;
        }
      });
    };
  
    // Initial call to function
    scalePreElement();
  
    // Add the event listener for window resize
    window.addEventListener('resize', scalePreElement);
  });
  