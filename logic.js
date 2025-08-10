const canvas = document.getElementById('memoryCanvas');
const ctx = canvas.getContext('2d');
let memoryBlocks = [];
let processes = [];

const processSizeInput = document.getElementById('processSize');
const addProcessBtn = document.getElementById('addProcessBtn');
const addMemoryBlockBtn = document.getElementById('addMemoryBlockBtn');
const calculateBtn = document.getElementById('calculateBtn');
const deallocateBtn = document.getElementById('deallocateBtn');
const clearBtn = document.getElementById('clearBtn');
const strategySelect = document.getElementById('strategySelect');
const memoryBlockSizeInput = document.getElementById('memoryBlockSize');
const memoryError = document.getElementById('memoryError');
const processError = document.getElementById('processError');
const memoryBlockList = document.getElementById('memoryBlockList');
const processList = document.getElementById('processList');
const currentStrategy = document.getElementById('currentStrategy');

// Add memory block
addMemoryBlockBtn.addEventListener('click', () => {
    const size = parseInt(memoryBlockSizeInput.value);
    if (size > 0) {
        memoryBlocks.push({ id: memoryBlocks.length + 1, size, free: true, processSize: null });
        memoryBlockSizeInput.value = '';
        memoryError.style.display = 'none';
        drawMemory();
        updateMemoryBlockList();
    } else {
        memoryError.style.display = 'block';
    }
});

// Add process
addProcessBtn.addEventListener('click', () => {
    const size = parseInt(processSizeInput.value);
    if (size > 0) {
        processes.push(size);
        processSizeInput.value = '';
        processError.style.display = 'none';
        updateProcessList();
    } else {
        processError.style.display = 'block';
    }
});

// Clear all
clearBtn.addEventListener('click', () => {
    memoryBlocks = [];
    processes = [];
    drawMemory();
    updateMemoryBlockList();
    updateProcessList();
    currentStrategy.textContent = '';
});

// Allocate based on strategy
calculateBtn.addEventListener('click', () => {
    const strategy = strategySelect.value;
    currentStrategy.textContent = `Running: ${strategy} strategy`;

    for (let process of processes) {
        let allocated = false;
        switch (strategy) {
            case 'firstFit':
                allocated = firstFit(process);
                break;
            case 'bestFit':
                allocated = bestFit(process);
                break;
            case 'worstFit':
                allocated = worstFit(process);
                break;
        }
        if (!allocated) {
            alert(`❌ No suitable block for process ${process} KB`);
        }
    }
    drawMemory();
});

// Deallocate memory
deallocateBtn.addEventListener('click', () => {
    memoryBlocks.forEach(block => {
        block.free = true;
        block.processSize = null;
    });
    drawMemory();
    currentStrategy.textContent = '🧹 All memory blocks deallocated';
});

// Display memory block list
function updateMemoryBlockList() {
    memoryBlockList.innerHTML = `Memory Blocks: ${memoryBlocks.map(block => `${block.size} KB`).join(', ')}`;
}

// Display process list
function updateProcessList() {
    processList.innerHTML = `Processes: ${processes.join(', ')} KB`;
}

// Allocation Strategies
function firstFit(processSize) {
    for (let block of memoryBlocks) {
        if (block.free && block.size >= processSize) {
            block.free = false;
            block.processSize = processSize;
            return true;
        }
    }
    return false;
}

function bestFit(processSize) {
    let bestBlock = null;
    for (let block of memoryBlocks) {
        if (block.free && block.size >= processSize) {
            if (!bestBlock || block.size < bestBlock.size) {
                bestBlock = block;
            }
        }
    }
    if (bestBlock) {
        bestBlock.free = false;
        bestBlock.processSize = processSize;
        return true;
    }
    return false;
}

function worstFit(processSize) {
    let worstBlock = null;
    for (let block of memoryBlocks) {
        if (block.free && block.size >= processSize) {
            if (!worstBlock || block.size > worstBlock.size) {
                worstBlock = block;
            }
        }
    }
    if (worstBlock) {
        worstBlock.free = false;
        worstBlock.processSize = processSize;
        return true;
    }
    return false;
}

// Draw memory visually
function drawMemory() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const x = 10, width = 80, height = 50, gap = 10;
    let y = 10;

    memoryBlocks.forEach((block, index) => {
        ctx.fillStyle = block.free ? '#8BC34A' : '#E57373';
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = '#000';
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(`Block ${index + 1}`, x + 10, y + 15);
        ctx.fillText(`${block.size} KB`, x + 10, y + 30);
        ctx.fillText(block.free ? 'Free' : `${block.processSize} KB`, x + 10, y + 45);

        y += height + gap;
    });
}
