/**
 * Resumo da manhã — junta Gmail, Agenda e Google Tarefas
 * e manda um e-mail pra você mesmo. Custo zero (roda no Google).
 *
 * Funções:
 *  - instalar()        -> rode UMA vez: agenda o envio diário
 *  - enviarResumo()    -> manda o resumo agora (serve de teste)
 */

var CONFIG = {
  HORA: 7,              // hora do envio (0-23)
  MAX_EMAILS: 10,       // quantos e-mails não lidos mostrar
  DIAS_EMAIL: 2         // olhar e-mails dos últimos X dias
};

function instalar() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'enviarResumo') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('enviarResumo').timeBased().everyDays(1).atHour(CONFIG.HORA).create();
  enviarResumo();
}

function enviarResumo() {
  var meuEmail = Session.getEffectiveUser().getEmail();
  var hoje = new Date();
  var assunto = '☀️ Resumo da manhã — ' +
    Utilities.formatDate(hoje, Session.getScriptTimeZone(), 'dd/MM (EEE)');
  var html = [
    '<div style="font-family:Arial,sans-serif;max-width:560px">',
    secaoAgenda_(),
    secaoTarefas_(),
    secaoEmails_(),
    '</div>'
  ].join('');
  MailApp.sendEmail({ to: meuEmail, subject: assunto, htmlBody: html });
}

function secaoAgenda_() {
  var tz = Session.getScriptTimeZone();
  var ini = new Date(); ini.setHours(0, 0, 0, 0);
  var fim = new Date(ini.getTime() + 24 * 3600 * 1000);
  var eventos = CalendarApp.getDefaultCalendar().getEvents(ini, fim);
  var itens = eventos.map(function (e) {
    var hora = e.isAllDayEvent() ? 'Dia todo'
      : Utilities.formatDate(e.getStartTime(), tz, 'HH:mm');
    return '<li><b>' + hora + '</b> — ' + esc_(e.getTitle()) + '</li>';
  });
  return bloco_('📅 Agenda de hoje', itens, 'Nada marcado. Dia livre!');
}

function secaoTarefas_() {
  var itens = [];
  try {
    var listas = Tasks.Tasklists.list().items || [];
    var tz = Session.getScriptTimeZone();
    var hojeStr = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    listas.forEach(function (l) {
      var ts = Tasks.Tasks.list(l.id, { showCompleted: false }).items || [];
      ts.forEach(function (t) {
        if (!t.due) return;                          // sem data: ignora
        var dia = t.due.substring(0, 10);            // 'due' vem como data (meia-noite UTC)
        if (dia > hojeStr) return;                   // só vencidas/de hoje
        itens.push('<li>' + (dia < hojeStr ? '⚠️ ' : '') + esc_(t.title) + '</li>');
      });
    });
  } catch (err) {
    itens.push('<li>Não consegui ler as Tarefas (' + esc_(err.message) + ')</li>');
  }
  return bloco_('✅ Tarefas de hoje', itens, 'Sem tarefas pra hoje.');
}

function secaoEmails_() {
  var threads = GmailApp.search(
    'is:unread in:inbox newer_than:' + CONFIG.DIAS_EMAIL + 'd -category:promotions -category:social',
    0, CONFIG.MAX_EMAILS);
  var itens = threads.map(function (t) {
    var de = t.getMessages()[0].getFrom().replace(/<.*>/, '').trim();
    return '<li><b>' + esc_(de) + '</b>: ' + esc_(t.getFirstMessageSubject()) + '</li>';
  });
  return bloco_('📧 E-mails não lidos', itens, 'Caixa de entrada zerada.');
}

function bloco_(titulo, itens, vazio) {
  return '<h3 style="margin:18px 0 6px">' + titulo + '</h3><ul style="padding-left:18px">' +
    (itens.length ? itens.join('') : '<li style="list-style:none">' + vazio + '</li>') + '</ul>';
}

function esc_(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
