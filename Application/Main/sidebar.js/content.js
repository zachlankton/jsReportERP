<script>
  // Get the Sidebar
  var mySidebar = document.getElementById("mySidebar");

  // Get the DIV with overlay effect
  var overlayBg = document.getElementById("myOverlay");

  var savingOverlay = document.getElementById("savingOverlay");

  // Toggle between showing and hiding the sidebar, and add overlay effect
  function w3_open() {
    if (mySidebar.style.display === 'block') {
      mySidebar.style.display = 'none';
      overlayBg.style.display = "none";
    } else {
      mySidebar.style.display = 'block';
      overlayBg.style.display = "block";
    }
  }

  // Close the sidebar with the close button
  function w3_close() {
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
  }

  function toggleAccordion(elm){
    var nextElm = elm.nextElementSibling ;
    if (nextElm.classList.contains("nested-menu")){
      nextElm.classList.toggle("w3-hide")
    }

    if (nextElm.classList.contains("accordion")){
      nextElm.classList.toggle("w3-hide")
    }
  }
</script>