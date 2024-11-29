document.addEventListener('DOMContentLoaded', () => {
    const backgroundGrid = document.getElementById('backgroundGrid');
    const GRID_COLUMNS = 10;
    const GRID_ROWS = 10;
    const totalCells = GRID_COLUMNS * GRID_ROWS;

    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    function createParticles(x, y, color, count = 30) {
        const particleCount = count;
        const colors = [
            color,
            adjustColorBrightness(color, 20),  
            adjustColorBrightness(color, -20) 
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const particleColor = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 2 + 1;
            const lifetime = Math.random() * 500 + 500;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = particleColor;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            document.body.appendChild(particle);
            
            const startTime = Date.now();
            
            function animateParticle() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / lifetime;
                
                if (progress < 1) {
                    const distance = velocity * elapsed;
                    const currentX = x + Math.cos(angle) * distance;
                    const currentY = y + Math.sin(angle) * distance - (progress * 50);
                    
                    particle.style.transform = `translate(${currentX - x}px, ${currentY - y}px)`;
                    particle.style.opacity = 1 - progress;
                    
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }
            
            requestAnimationFrame(animateParticle);
        }
    }

    function adjustColorBrightness(hex, percent) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);

        r = Math.max(0, Math.min(255, r + percent));
        g = Math.max(0, Math.min(255, g + percent));
        b = Math.max(0, Math.min(255, b + percent));

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    themeToggle.addEventListener('click', (e) => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        const rect = themeToggle.getBoundingClientRect();
        createParticles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            newTheme === 'dark' ? '#ffffff' : '#333333'
        );
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);

        const gridCells = document.querySelectorAll('.background-grid div');
        gridCells.forEach((cell, index) => {
            setTimeout(() => {
                const cellRect = cell.getBoundingClientRect();
                const newColor = newTheme === 'dark' ? '#333333' : '#3498db';
                
                createParticles(
                    cellRect.left + cellRect.width / 2,
                    cellRect.top + cellRect.height / 2,
                    newColor,
                    15 
                );

                cell.style.transition = 'background-color 0.5s ease';
                cell.style.backgroundColor = newColor;
            }, index * 10);
        });
    });

    function updateIcon(theme) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    const gridCells = [];
    for (let i = 0; i < totalCells; i++) {
        const div = document.createElement('div');
        div.classList.add(i % 2 === 0 ? 'even' : 'odd');
        
        div.addEventListener('mouseenter', () => {
            const randomColor = hoverColors[Math.floor(Math.random() * hoverColors.length)];
            div.style.backgroundColor = randomColor;
            div.style.boxShadow = `0 0 10px ${randomColor}`;
        });

        div.addEventListener('mouseleave', () => {
            div.style.backgroundColor = '';
            div.style.boxShadow = '';
        });

        gridCells.push(div);
        backgroundGrid.appendChild(div);
    }

    const rippleColors = {
        box1: '#e74c3c',
        box2: '#2ecc71',
        box3: '#f1c40f'
    };

    const hoverColors = [
        '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', 
        '#e67e22', '#1abc9c', '#34495e', '#d35400'
    ];

    function createRipple(startIndex, color) {
        const startPos = {
            row: Math.floor(startIndex / GRID_COLUMNS),
            col: startIndex % GRID_COLUMNS
        };

        gridCells.forEach((cell, index) => {
            const currentPos = {
                row: Math.floor(index / GRID_COLUMNS),
                col: index % GRID_COLUMNS
            };

            const distance = Math.sqrt(
                Math.pow(currentPos.row - startPos.row, 2) + 
                Math.pow(currentPos.col - startPos.col, 2)
            );

            const delay = distance * 100;

            setTimeout(() => {
                const cellRect = cell.getBoundingClientRect();
                createParticles(
                    cellRect.left + cellRect.width / 2,
                    cellRect.top + cellRect.height / 2,
                    color,
                    10 
                );

                cell.style.backgroundColor = color;
                cell.style.transform = 'scale(1.3)';
                cell.style.zIndex = '1';
                
                setTimeout(() => {
                    cell.style.transform = 'scale(1)';
                    cell.style.backgroundColor = '';
                    
                    setTimeout(() => {
                        cell.style.zIndex = '0';
                    }, 300);
                }, 300);
            }, delay);
        });
    }

    document.querySelectorAll('.box').forEach((box, boxIndex) => {
        box.addEventListener('click', (e) => {
            const boxRect = box.getBoundingClientRect();
            const boxCenterX = boxRect.left + boxRect.width / 2;
            const boxCenterY = boxRect.top + boxRect.height / 2;

            let closestIndex = 0;
            let minDistance = Infinity;

            gridCells.forEach((cell, index) => {
                const cellRect = cell.getBoundingClientRect();
                const cellCenterX = cellRect.left + cellRect.width / 2;
                const cellCenterY = cellRect.top + cellRect.height / 2;

                const distance = Math.sqrt(
                    Math.pow(boxCenterX - cellCenterX, 2) + 
                    Math.pow(boxCenterY - cellCenterY, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            const boxId = box.id;
            const rippleColor = rippleColors[boxId];
            createRipple(closestIndex, rippleColor);
        });
    });

    function createColorWave() {
        let index = 0;
        
        const wave = setInterval(() => {
            if (index < gridCells.length) {
                const cell = gridCells[index];
                const randomColor = hoverColors[Math.floor(Math.random() * hoverColors.length)];
                
                cell.style.backgroundColor = randomColor;
                setTimeout(() => {
                    cell.style.backgroundColor = '';
                }, 500);
                
                index++;
            } else {
                index = 0;
            }
        }, 50);
    }

    function adjustGridHeight() {
        gridCells.forEach(cell => {
            const width = cell.offsetWidth;
            cell.style.height = `${width}px`;
        });
    }

    adjustGridHeight();
    window.addEventListener('resize', adjustGridHeight);
    createColorWave();
}); 
