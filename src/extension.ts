import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('"milestone-vscode" is now active!');
	var fs = require('fs');
	var obj = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '../words.json'), 'utf8')); // handle error

	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	var today = new Date();

	let month = monthNames[today.getMonth()];
	let date = today.getUTCDate();
	let dateStr = '';
	if (date < 10) { 
		dateStr = '0' + date
	}

	let year = today.getFullYear();
	let day = dayNames[today.getDay()];

	let todayLine = `${month} ${dateStr}, ${year}, ${day}`;
	console.log(todayLine);

	const disposable = vscode.languages.registerCompletionItemProvider(
		'markdown',
		{
			provideCompletionItems(document, position, token, context) {
				let suggestion = (text: any) => {
					let item = new vscode.CompletionItem(text, vscode.CompletionItemKind.Keyword);
					return item;
				}

				var items = new Array();
				for (var w of obj['words']) {
					items.push(suggestion(w));
				}
				items.push(suggestion(todayLine));

				return items;
			}
		},
		'.' // trigger
	);

	context.subscriptions.push(disposable);
}

export function deactivate(context: vscode.ExtensionContext) {
	console.log('"milestone-vscode" is now inactive!');
}
