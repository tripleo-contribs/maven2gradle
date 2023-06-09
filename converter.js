/**
 * Created by sbernstein on 4/8/15.
 */
function parseAndGenerate() {
    var text = document.getElementById('input').value;

    var parser = new DOMParser();
    var parsedDeps = parser.parseFromString(text, 'text/xml');
    var shouldAddOuterClosure = parsedDeps.getElementsByTagName('dependencies').length;
    if (!shouldAddOuterClosure) {
        text = '<root>' + text + '</root>';
        parsedDeps = parser.parseFromString(text, 'text/xml');
    }
    var depElems = parsedDeps.getElementsByTagName('dependency');
    var grDeps = [];
    for (var i = 0; i < depElems.length; i++) {
        var depElem = depElems[i];
        var scopeElems = depElem.getElementsByTagName('scope');


        var scope = document.getElementById('choicebox').value;

        if (scopeElems.length && scopeElems[0].innerHTML == 'test') {
            scope = 'testCompile';
        }
        var group = depElem.getElementsByTagName('groupId')[0].innerHTML;
        var artifact = depElem.getElementsByTagName('artifactId')[0].innerHTML;
        var versionElems = depElem.getElementsByTagName('version');
        var version = '*';
        if (versionElems.length) {
            version = versionElems[0].innerHTML;
        }

        var kotlin = document.getElementById('kotlin').checked;

        if (kotlin) {
            grDeps.push(scope + ' (' + '"' + group + ":" + artifact + ":" + version + '")');
        } else {
            grDeps.push(scope + ' ' + '\'' + group + ":" + artifact + ":" + version + '\'');
        }
    }
    var grDepsOutput = grDeps.join('\n');

    if (depElems.length > 1) {
        grDepsOutput = 'dependencies {\n\t' + grDepsOutput.replace(/\n/g, '\n\t') + '\n}'
    }

    let dsl = document.getElementById('gradleDSL').checked;

    if (dsl && depElems.length > 0) {
        grDepsOutput = "repositories {\n" +
            "    mavenCentral()\n" +
            "    mavenLocal()\n" +
            "}\n\n" + grDepsOutput
    }

    return grDepsOutput;
}

function convert() {
    var ok = document.getElementById('success');
    var empty = document.getElementById('empty');
    var fail = document.getElementById('failed');
    ok.hidden = true;
    empty.hidden = true;
    fail.hidden = true;
    var output = document.getElementById('output');
    try {
        output.value = parseAndGenerate();
        if (output.value) {
            ok.hidden = false;
            output.select();
        } else {
            empty.hidden = false;
        }
    } catch (err) {
        output.value = '';
        fail.hidden = false;
    }

}