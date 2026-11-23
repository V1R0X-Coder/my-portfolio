const events = {
  sunset:{title:"Sunset Sessions",category:"LIVE MUSIC",date:"Friday, 28 November · 5:30 PM",place:"Kano · Sample venue",description:"An easy evening of live sets, good company and golden-hour energy. This demo listing imagines a relaxed outdoor music gathering.",price:"Sample price: ₦5,000"},
  makers:{title:"The Makers Market",category:"ART & CULTURE",date:"Saturday, 29 November · 11:00 AM",place:"Lagos · Sample venue",description:"A playful pop-up celebrating independent makers, design, handmade objects and the people behind them.",price:"Sample listing: Free entry"},
  coding:{title:"Build Your First Website",category:"WORKSHOP",date:"Sunday, 30 November · 2:00 PM",place:"Online · Sample session",description:"A beginner-friendly creative coding session focused on understanding the building blocks of a simple web page.",price:"Sample listing: Free"},
  green:{title:"Green Together Day",category:"COMMUNITY",date:"Sunday, 7 December · 9:00 AM",place:"Kano · Sample meeting point",description:"Meet neighbours, care for shared spaces and make a positive local impact through a friendly community activity.",price:"Sample listing: Free"}
};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let activeFilter="all", selectedEvent=null, saved=[];
try{saved=JSON.parse(localStorage.getItem("luma-saved")||"[]")}catch{}
const grid=$("#event-grid"), search=$("#event-search"), dialog=$("#event-dialog"), toast=$("#toast");
function notify(message){toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2100)}
function persist(){try{localStorage.setItem("luma-saved",JSON.stringify(saved))}catch{};renderSaved();$("#saved-count").textContent=saved.length}
function filterEvents(){let count=0;$$(".event-card").forEach(card=>{const category=activeFilter==="all"||card.dataset.category===activeFilter;const query=search.value.trim().toLowerCase();const text=(card.dataset.search+" "+card.textContent).toLowerCase();const show=category&&(!query||text.includes(query));card.hidden=!show;if(show)count++});$("#empty-state").hidden=count!==0}
$$(".filters button").forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;$$(".filters button").forEach(b=>{const on=b===button;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on))});filterEvents()}));
search.addEventListener("input",filterEvents);
function renderSaved(){const list=$("#saved-list");list.replaceChildren();if(!saved.length){const p=document.createElement("p");p.className="saved-empty";p.textContent="Your saved events will appear here.";list.append(p);return}saved.forEach(id=>{const e=events[id];if(!e)return;const row=document.createElement("div");row.className="saved-item";const text=document.createElement("div");const strong=document.createElement("strong");strong.textContent=e.title;const small=document.createElement("small");small.textContent=e.date;text.append(strong,small);const remove=document.createElement("button");remove.textContent="REMOVE ×";remove.addEventListener("click",()=>{saved=saved.filter(x=>x!==id);persist()});row.append(text,remove);list.append(row)})}
function updateSaveButton(){const isSaved=saved.includes(selectedEvent);$("#dialog-save").textContent=isSaved?"♥ SAVED — REMOVE":"♡ SAVE EVENT"}
function openEvent(id){selectedEvent=id;const e=events[id];if(!e)return;$("#dialog-category").textContent=e.category;$("#dialog-title").textContent=e.title;$("#dialog-description").textContent=e.description;$("#dialog-details").textContent=`${e.date}  ·  ${e.place}  ·  ${e.price}`;$("#event-enquiry").href=`mailto:ericushie3@gmail.com?subject=${encodeURIComponent("Luma Events demo enquiry: "+e.title)}&body=${encodeURIComponent("Hello Eric,\\n\\nI am looking at the Luma Events demo and would like to ask about "+e.title+".")}`;updateSaveButton();dialog.showModal()}
$$(".event-open").forEach(button=>button.addEventListener("click",()=>openEvent(button.dataset.event)));
$("#dialog-save").addEventListener("click",()=>{if(!selectedEvent)return;if(saved.includes(selectedEvent))saved=saved.filter(x=>x!==selectedEvent);else saved.push(selectedEvent);persist();updateSaveButton();notify(saved.includes(selectedEvent)?"Event saved on this device.":"Event removed from saved list.")});
$("#close-dialog").addEventListener("click",()=>dialog.close());dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
$("#mobile-menu").addEventListener("click",()=>notify("Use the section links by scrolling the page."));
persist();
