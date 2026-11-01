const boardEl=document.getElementById("board");
const statusEl=document.getElementById("status");
const titleEl=document.getElementById("gameTitle");
const winLines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let board=Array(9).fill(""), current="X", mode="computer", gameOver=false, wins={X:0,O:0}, winningCells=[];
const $=id=>document.getElementById(id);
function setStatus(message,kind=""){statusEl.className="status "+kind;statusEl.replaceChildren();const dot=document.createElement("span");dot.className="status-dot";const text=document.createElement("span");text.textContent=message;statusEl.append(dot,text);}
function winnerFor(cells){for(const line of winLines){const [a,b,c]=line;if(cells[a]&&cells[a]===cells[b]&&cells[a]===cells[c])return {mark:cells[a],line};}return null;}
function renderBoard(){
 boardEl.replaceChildren();
 board.forEach((mark,index)=>{const cell=document.createElement("button");cell.className="cell"+(mark?" "+mark.toLowerCase():"")+(winningCells.includes(index)?" winner":"");cell.setAttribute("role","gridcell");cell.setAttribute("aria-label",`Square ${index+1}${mark?", "+mark:" empty"}`);cell.textContent=mark;cell.disabled=gameOver||Boolean(mark)||(mode==="computer"&&current==="O");cell.addEventListener("click",()=>play(index));boardEl.appendChild(cell);});
 $("winsX").textContent=wins.X;$("winsO").textContent=wins.O;
 $("scoreX").classList.toggle("active-score",!gameOver&&current==="X");$("scoreO").classList.toggle("active-score",!gameOver&&current==="O");
}
function play(index){
 if(gameOver||board[index]||(mode==="computer"&&current==="O"))return;
 board[index]=current;afterMove();
 if(!gameOver&&mode==="computer"&&current==="O"){renderBoard();setStatus("Computer is thinking…");window.setTimeout(computerMove,350);}
}
function afterMove(){
 const result=winnerFor(board);
 if(result){gameOver=true;winningCells=result.line;wins[result.mark]++;const winnerName=mode==="computer"?(result.mark==="X"?"You":"Computer"):(result.mark==="X"?"Player X":"Player O");titleEl.textContent=winnerName+" win!";setStatus(winnerName+" got three in a row!", "win");renderBoard();return;}
 if(board.every(Boolean)){gameOver=true;titleEl.textContent="It's a draw";setStatus("A draw! Try another round.");renderBoard();return;}
 current=current==="X"?"O":"X";
 titleEl.textContent=mode==="computer"?(current==="X"?"Your move":"Computer's turn"):`Player ${current}'s turn`;
 setStatus(mode==="computer"?(current==="X"?"Choose a square to make your move.":"Computer is thinking…"):`Player ${current}, choose a square.`);
 renderBoard();
}
function computerMove(){
 if(gameOver||mode!=="computer"||current!=="O")return;
 // Prefer a winning move, then block the human, then take center/corners.
 let move=findStrategicMove("O");
 if(move<0)move=findStrategicMove("X");
 if(move<0&& !board[4])move=4;
 if(move<0){const corners=[0,2,6,8].filter(i=>!board[i]);if(corners.length)move=corners[Math.floor(Math.random()*corners.length)];}
 if(move<0){const empty=board.map((v,i)=>v? -1:i).filter(i=>i>=0);move=empty[Math.floor(Math.random()*empty.length)];}
 if(move===undefined||move<0)return;
 board[move]="O";afterMove();
}
function findStrategicMove(mark){for(let i=0;i<9;i++){if(!board[i]){board[i]=mark;const won=Boolean(winnerFor(board));board[i]="";if(won)return i;}}return -1;}
function newRound(){board=Array(9).fill("");current="X";gameOver=false;winningCells=[];titleEl.textContent="Your move";setStatus("Choose a square to begin.");renderBoard();}
function setMode(next){mode=next;document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));$("nameX").textContent=mode==="computer"?"YOU":"PLAYER X";$("nameO").textContent=mode==="computer"?"CPU":"PLAYER O";newRound();}
document.querySelectorAll(".mode").forEach(button=>button.addEventListener("click",()=>setMode(button.dataset.mode)));
$("restart").addEventListener("click",newRound);$("newRound").addEventListener("click",newRound);$("resetScores").addEventListener("click",()=>{wins={X:0,O:0};newRound();});
renderBoard();