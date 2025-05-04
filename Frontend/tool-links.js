document.addEventListener("DOMContentLoaded", () => {
    // Get all tool cards
    const toolCards = document.querySelectorAll(".tool-card")
  
    // Add click event listeners to each card
    toolCards.forEach((card) => {
      card.addEventListener("click", function () {
        // Get the tool name from the card's heading
        const toolName = this.querySelector("h3").textContent.trim();
              
        // Determine which page to navigate to based on the tool name
        let targetPage;
        switch(toolName) {
          case 'Password Strength Analyzer':
            targetPage = 'password-analyzer.html';
            break;
          case 'Encryption/Decryption':
            targetPage = 'encryption-tool.html';
            break;
          case 'File Integrity Check':
            targetPage = 'file-integrity.html';
            break;
          case 'Credentials Leak Check':
            targetPage = 'credentials-leak.html';
            break;
          case 'Network Monitoring':
            targetPage = 'network-monitoring.html';
            break;
          case 'Logs':
            targetPage = 'logs-analyzer.html';
            break;
          case 'Malicious File Detection':
            targetPage = 'malicious-file-detection.html';
            break;
          default:
            // Default to index page if tool not recognized
            targetPage = 'index.html';
        }
              
        // Navigate to the target page
        window.location.href = targetPage;
      })
  
      // Add cursor pointer style to indicate clickable
      card.style.cursor = "pointer"
    })
  })
  