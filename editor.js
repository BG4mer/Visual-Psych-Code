let currentFile = { name: "main.lua", language: "lua", content: "-- Lua script\n" };
let files = [currentFile];
let editor;

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.39.0/min/vs' }});
require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: currentFile.content,
    language: currentFile.language,
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 16
  });

  updateFileList();
  updateSnippets();
  updateTabs();
});

function updateTabs() {
  const tabsBar = document.getElementById('tabs-bar');
  tabsBar.innerHTML = '';
  files.forEach(f => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (f.name === currentFile.name ? ' active' : '');
    tab.textContent = f.name;
    tab.onclick = () => selectFile(f);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.onclick = (e) => { e.stopPropagation(); closeFile(f); };

    tab.appendChild(closeBtn);
    tabsBar.appendChild(tab);
  });
}

function updateFileList() {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '';
  files.forEach(f => {
    const div = document.createElement('div');
    div.textContent = f.name;
    div.style.cursor = 'pointer';
    div.onclick = () => selectFile(f);
    fileList.appendChild(div);
  });
}

function updateSnippets() {
  const snippetList = document.getElementById('snippet-list');
  snippetList.innerHTML = '';
  const langSnippets = snippets[currentFile.language] || {};
  for (const key in langSnippets) {
    const div = document.createElement('div');
    div.textContent = key;
    div.style.cursor = 'pointer';
    div.onclick = () => insertSnippet(langSnippets[key]);
    snippetList.appendChild(div);
  }
}

function selectFile(file) {
  currentFile.content = editor.getValue();
  currentFile = file;
  editor.setValue(currentFile.content);
  monaco.editor.setModelLanguage(editor.getModel(), currentFile.language);
  updateTabs();
  updateSnippets();
}

function insertSnippet(snippet) {
  const pos = editor.getPosition();
  editor.executeEdits("", [{ range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column), text: snippet }]);
}

function newFile(lang) {
  const name = `new_file_${files.length+1}.${lang==='lua'?'lua':'hx'}`;
  const f = { name, language: lang, content: '' };
  files.push(f);
  selectFile(f);
  updateFileList();
  updateTabs();
}

function closeFile(fileToClose) {
  files = files.filter(f => f.name !== fileToClose.name);
  if (currentFile.name === fileToClose.name) {
    currentFile = files[0] || { name: "main.lua", language: "lua", content: "" };
    editor.setValue(currentFile.content);
    monaco.editor.setModelLanguage(editor.getModel(), currentFile.language);
  }
  updateTabs();
  updateFileList();
  updateSnippets();
}

function saveFile() {
  const element = document.createElement("a");
  const file = new Blob([editor.getValue()], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = currentFile.name;
  document.body.appendChild(element);
  element.click();
}

function runLua() {
  const luaCode = editor.getValue();
  try {
    fengari.load(luaCode)();
  } catch(e) {
    console.error("Lua Error:", e);
    alert("Lua Error: "+e);
  }
}