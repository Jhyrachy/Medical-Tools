function calcolo() {
    var dosePastiglia = 5;                                                              //dosaggio singola pastiglia
    var ultimoINR = parseFloat(document.getElementById('INR').value);                   //nuovo INR
    var targetINR = parseFloat(document.getElementById('INRtarget').value);             //INR da raggiungere
    var dose1 = parseFloat(document.getElementById('dose1').value);                     //dose lunedì
    var dose2 = parseFloat(document.getElementById('dose2').value);                     //dose martedì
    var dose3 = parseFloat(document.getElementById('dose3').value);                     //dose mercoledì
    var dose4 = parseFloat(document.getElementById('dose4').value);                     //dose giovedì
    var dose5 = parseFloat(document.getElementById('dose5').value);                     //dose venerdì
    var dose6 = parseFloat(document.getElementById('dose6').value);                     //dose sabato
    var dose7 = parseFloat(document.getElementById('dose7').value);                     //dose domenica
    var numeroPasticcheAttuali = dose1+dose2+dose3+dose4+dose5+dose6+dose7;             //dose complessiva settimanale
    var doseAttuale = numeroPasticcheAttuali * dosePastiglia;
    var defaultINR = 2.5;                                                               //valore INR "normale"
    var aggINR = targetINR-defaultINR;                                                  //differenza tra INR target e INR normale
    var compareINR = ultimoINR-aggINR;                                                  //valore di INR usato nei calcoli interni
    var sospensione = 0;
    var settimana = 0;
    var tempComparazione;
    var frasario = ["","","","","","",""];
    var doseQ = [0,0,0,0,0,0,0];
    var doseI = [0,0,0,0,0,0,0];
    var i;
    var userPosta = 'dott.jacopopieri';
    var domainPosta = 'gmail.com';
    
    cleanAnswer();

    var distribuzioneUno        = [0,0,0,1,0,0,0];
    var distribuzioneDue        = [0,1,0,0,0,1,0];
    var distribuzioneTre        = [0,1,0,1,0,1,0];
    var distribuzioneQuattro    = [1,0,1,0,1,0,1];
    var distribuzioneCinque     = [1,1,0,1,0,1,1];
    var distribuzioneSei        = [1,1,1,0,1,1,1];

    var nuovoDosaggio;

    //calcolo variazione dosaggio
    tempComparazione = comparazione(compareINR, doseAttuale);
    
    nuovoDosaggio = tempComparazione.toString().slice(0, tempComparazione.length-1);
    sospensione = tempComparazione.toString().charAt( tempComparazione.length-1 );
    
    var numeroQuarti = Math.round(nuovoDosaggio/(dosePastiglia/4));
    var doseFinale = numeroQuarti*(dosePastiglia/4);
    var numeroNuovePasticche = numeroQuarti/4;

    while(numeroQuarti >= 7){
        numeroQuarti -= 7;
        settimana++;
    }

    switch(numeroQuarti){
        case 1:
            for(i=0; i <= 6; i++){
                doseQ[i] = distribuzioneUno[i];
            }
            break;
        case 2:
            for(i=0; i <= 6; i++){
                doseQ[i] = distribuzioneDue[i];
            }
            break;
        case 3:
            for(i=0; i <= 6; i++){
                doseQ[i] = distribuzioneTre[i];
            }
            break;
        case 4:
            for(i=0; i <= 6; i++){
                doseQ[i] = distribuzioneQuattro[i];
            }
            break;
        case 5:
            for(i=0; i <= 6; i++){
                doseQ[i] = distribuzioneCinque[i];
            }
            break;
        case 6:
            for(i=0; i <= 6; i++){
                doseQ[i] = distribuzioneSei[i];
            }
            break;
    }

    for(i=0; i <= 6; i++){
        doseQ[i] += settimana;
        while(doseQ[i] >= 4){
            doseQ[i] -= 4;
            doseI[i]++;
        }
    }

    //frasario dosaggio
    var tempDosaggio = " mg";
    switch(sospensione){
        case 1:
            tempDosaggio = tempDosaggio + ", sospendere per 1gg";
            break;
        case 2:
            tempDosaggio = tempDosaggio + ", sospendere per 2gg";
            break;
        default:
    }

    //frasario distribuzione
    for(i=0; i <= 6; i++){
        var intera = "";
        var parziale = "";
        var congiunzione = "";

        if(doseI[i] > 0){
            if(doseI[i] == 1){
                intera = doseI[i] + " intera";
            }
            if(doseI[i] > 1){
                intera = doseI[i] + " intere";
            }
            congiunzione = " e ";
        }
        if(doseQ[i] > 0){
            if(doseQ[i] == 1){
                parziale = congiunzione + "1 quarto";
            }
            if(doseQ[i] == 2){
                parziale = congiunzione + "una metà (2 quarti)";
            }
            if(doseQ[i] == 3){
                parziale = congiunzione + "3 quarti";
            }
        }


        frasario[i] = intera + parziale;

        if(frasario[i] === ""){
            frasario[i] = "Oggi niente";
        }
    }

    document.getElementById("terapia").innerHTML =  "<div class=\"mb-3 ml-3\">\
                                                    <span style=\"color:red;\">Nuovo Dosaggio Settimanale:</span> " +  doseFinale + " mg\
                                                    - ( " + numeroNuovePasticche + " compresse settimanali)" + "<br>\
                                                    <span style=\"color:gray;\">Dosaggio Precedente: " +  doseAttuale + " mg\
                                                    - ( " + numeroPasticcheAttuali + " compresse settimanali) </div>\
                                                    <div class=\"ml-5\"> \
                                                    " + "Lunedì: " + frasario[0] + "<br>\
                                                    <span style=\"color:gray;\">Martedì: " + frasario[1] + "</span><br>\
                                                    Mercoledì: " + frasario[2] + "<br>\
                                                    <span style=\"color:gray;\">Giovedì: " + frasario[3] + "</span><br>\
                                                    Venerdì: " + frasario[4] + "<br>\
                                                    <span style=\"color:gray;\">Sabato: " + frasario[5] + "</span><br>\
                                                    Domenica: " + frasario[6] + "<div>";
}

function percentage(verso, valore, percentuale) {
    
    if(verso === 1){
        valore += (valore/100)*percentuale;
    }
    if(verso === 0){
        valore -= (valore/100)*percentuale;
    }
    
    return valore.toFixed(2);
}

function cleanAnswer(){
    document.getElementById("terapia").innerHTML = "";
}

function comparazione(compareINR, doseAttuale){

    var nuovoDosaggio;
    var sospensione;

    if(compareINR <= 1.3){
        nuovoDosaggio = percentage(1, doseAttuale, 50);
        sospensione = '0';
        return nuovoDosaggio+sospensione;
    }
    if(compareINR > 1.3 && compareINR < 1.5){
        nuovoDosaggio = percentage(1, doseAttuale, 33);
        sospensione = '0';
        return nuovoDosaggio+sospensione;
    }
    if(compareINR >= 1.5 && compareINR < 1.9){
        nuovoDosaggio = percentage(1, doseAttuale, 25);
        sospensione = '0';
        return nuovoDosaggio+sospensione;
    }
    if(compareINR >= 1.9 && compareINR < 2){
        nuovoDosaggio = percentage(1, doseAttuale, 10);
        sospensione = '0';
        return nuovoDosaggio+sospensione;
    }
    if(compareINR >= 2 && compareINR <= 2.8){
        nuovoDosaggio = doseAttuale;
        sospensione = '0';
        return nuovoDosaggio+sospensione;
    }
    if(compareINR > 2.8 && compareINR <= 3.1){
        nuovoDosaggio = percentage(0, doseAttuale, 10);
        sospensione = '0';
        return nuovoDosaggio+sospensione;
    }
    if(compareINR > 3.1 && compareINR <= 3.5){
        nuovoDosaggio = percentage(0, doseAttuale, 25);
        sospensione = '0';
        return nuovoDosaggio+sospensione;
    }
    if(compareINR > 3.5 && compareINR < 4){
        nuovoDosaggio = percentage(0, doseAttuale, 33);
        sospensione = 1;
        return nuovoDosaggio+sospensione;
    }
    if(compareINR >= 4 && compareINR < 4.5){
        nuovoDosaggio = percentage(0, doseAttuale, 33);
        sospensione = 2;
        return nuovoDosaggio+sospensione;
    }
    if(compareINR >= 4.5 && compareINR < 6){
        document.getElementById("terapia").innerHTML ="<div class=\"mb-3 ml-3\">\
                                                        <span style=\"color:red;\">Assenza di emorragia</span><br>\
                                                        Sospendere la terapia per 1-2 giorni e poi ridurre il dosaggio di warfarinf di 1,25-2.5mg e controllare INR il prima possibile <br><br><br>\
                                                        <span style=\"color:red;\">Presenza di emorragia scarsamente significativa</span><br>\
                                                        Sospendere la terapia e somministrare vitamina-K 0,5-1mg per OS, ricontrollare INR entro 24 ore.\
                                                         Istruire il paziente a recarsi immediatamente in ospedale in caso di peggioramento dell'emorragia";
        return;
    }
    if(compareINR >= 6 && compareINR <= 10){
        document.getElementById("terapia").innerHTML ="<div class=\"mb-3 ml-3\">\
                                                        In <span style=\"color:red;\">assenza di emorragia</span>, sospendere la terapia e somministrare vitamina-K 0,5-1mg per OS e ricontrollare INR dopo 24h;\
                                                         successivamente regolarsi in base ai valori di INR";
        return;
    }
    if(compareINR > 10){
        document.getElementById("terapia").innerHTML ="<div class=\"mb-3 ml-3\">\
                                                        <span style=\"color:red;\">Valore fuori scala</span><br>Controllare di aver inserito i valori giusti.\
                                                         Nel caso, rivolgersi alla sede di competenza più vicina.";
        return;
    } else {
                document.getElementById("terapia").innerHTML ="<div class=\"mb-3 ml-3\">\
                                                        <span style=\"color:red;\">ERRORE NELL'INPUT</span><br>Si è verificato un problema a processare i valori inseriti.<br>\
                                                         Per favore inviate una mail a <b><a href=\"mailto:'" + userPosta + "&#64;" + domainPosta + '">' + 
			                                                userPosta + "&#64;" + domainPosta + "</a></b> indicando i dati inseriti, grazie della collaborazione."
			                                                ;
                return;
            }
    
}

function analisi() {
    //Variabili importate dal modulo
    var ph = parseFloat(document.getElementById('ph').value);                           //Valore del pH
    var po2_arteriosa = parseFloat(document.getElementById('po2_arteriosa').value);     //Pressione O2 arteriosa
    var paco2 = parseFloat(document.getElementById('paco2').value);                     //Pressione CO2
    var hco3 = parseFloat(document.getElementById('hco3').value);                       //Dosaggio bicarbonato
    var sodio = parseFloat(document.getElementById('sodio').value);                     //Dosaggio sodio
    var potassio = parseFloat(document.getElementById('potassio').value);               //Dosaggio potassio
    var cloro = parseFloat(document.getElementById('cloro').value);                     //Dosaggio cloro
    var lattato = parseFloat(document.getElementById('lattato').value);                 //Dosaggio lattato
    var anni = parseFloat(document.getElementById('anni').value);                       //Anni del paziente
    var fio2 = parseFloat(document.getElementById('fio2').value);                       //Percentuale di ossigeno nel gas inspirato
    var patm = parseFloat(document.getElementById('patm').value);                       //Pressione atmosferica
    var ph2o = parseFloat(document.getElementById('ph2o').value);                       //Pressione Parziale Acqua
    var quoziente_respiratorio = parseFloat(document.getElementById('quoziente_respiratorio').value);                 //Rapporto produzione CO2 su consumo O2

    //Variabili calcolate
    var morowitz = po2_arteriosa/fio2;                                                  //Indice di Morowitz, rapporto tra PaO2 e FiO2. Se alterato, problemi negli scambi respiratori (ventilazione, diffusione, perfusione)
    var po2_alveolare = fio2*(patm-ph20)-(paco2/quoziente_respiratorio);                //Pressione dell'ossigeno nell'alveolo
    var delta_po2 = po2_alveolare - po2_arteriosa;                                      //Differenziale tra pressione O2 in aria e negli alveoli, un differenziale troppo alto indica un'alterazione svera degli scambi respiratori (es. ARDS)
    var delta_po2_normale = (anni/4)+4;                                       //Calcolo del delta normalizzato per età (anni/4). sarebbe +-4, ma per i nostri calcoli consideriamo solo il limite superiore

    //Variabili di contatto
    var userPosta = 'dott.jacopopieri';
    var domainPosta = 'gmail.com';

    //Variabili dei risultati
    var ipossia = 0;
    var grav_horowitz = 0;
    var scompenso_delta_po2 = 0;
    var stato_acido = 1;                    //0 acido, 1 neutro, 2 basico
    var scompenso_co2 = 1                   //0 = bassa, 1 = normale, 2 alta
    var scompenso_hco3 = 1                   //0 = bassa, 1 = normale, 2 alta
    var disturbo;
    
    cleanAnswer();

    //Step di risoluzione di un emogas
    //1) Valutazione ossigenazione
    
    //Se PaO2 è inferiore agli 80mmHg, siamo in ipossia.
    if(po2_arteriosa < 80) ipossia = 1;

    //Studio del Morowitz (P/F)
    if(morowitz < 450) grav_horowitz = 1;               //Maggiore di 450 è normale
    if(morowitz < 300) grav_horowitz = 2;               //tra 450 e 300 è alterazione live, sotto i 300 è grave.

    //Studio Gradiente alveolo-arterioso
    if(delta_po2 > delta_po2_normale) scompenso_delta_po2 = 1;  //Se il delta è maggiore del calcolato, è scompenso lieve
    if(delta_po2 >= 20) scompenso_delta_po2 = 2;                //Se superiore a 20 è scompenso moderato
    if(delta_po2 >= 50) scompenso_delta_po2 = 3;                //Se superiore a 50 scompenso grave

    //
    //2) Studio del pH
    if(ph > 7.45) stato_acido = 2;                  //superiore a 7.45, siamo in ph BASICO
    if(ph < 7.35) stato_acido = 0;                  //inferiore a 7.35, siamo in ph ACIDO
        //In caso di pH normali con alterazioni di CO2 e HCO3 siamo in disturbo primario COMPENSATO
    
    //
    //3) Analisi della PCO2
    if(paco2 > 42) scompenso_co2 = 2;               //PaCo2 troppo alta
    if(paco2 < 42) scompenso_co2 = 0;               //PaCo2 troppo bassa

    //Studio concordanza CO2
    if(stato_acido === 0 && scompenso_co2 === 0) disturbo = "Acidosi metabolica con compenso respiratorio";             //Concordanza con pH ridotto è acidosi metabolica con compenso respiratorio
    if(stato_acido === 2 && scompenso_co2 === 2) disturbo = "Alcalosi metabolica con compenso respiratorio";            //Concordanza con pH aumentato è alcalosi metabolica con compenso respiratorio
    if(stato_acido === 0 && scompenso_co2 === 2) disturbo = "Acidosi respiratoria";                                     //Discordanza con pH ridotto è acidosi respiratoria
    if(stato_acido === 2 && scompenso_co2 === 0) disturbo = "Alcalosi respiratoria";                                    //Discordanza con pH aumentato è alcalosi respiratoria

    //
    //4) Analisi dei bicarbonati
    if(hco3 > 26) scompenso_hco3 = 2;               //PaCo2 troppo alta
    if(hco3 < 24) scompenso_hco3 = 0;               //PaCo2 troppo bassa

    //Studio concordanza HCO3
    if(stato_acido === 0 && scompenso_hco3 === 0) disturbo = "Acidosi metabolica";                                                  //Concordanza con pH ridotto è acidosi metabolica
    if(stato_acido === 2 && scompenso_hco3 === 2) disturbo = "Alcalosi metabolica";                                                 //Concordanza con pH aumentato è alcalosi metabolica
    if(stato_acido === 0 && scompenso_hco3 === 2) disturbo = "Acidosi respiratoria con compenso metabolico secondario";             //Discordanza con pH ridotto è acidosi respiratoria con compenso metabolico secondario
    if(stato_acido === 2 && scompenso_hco3 === 0) disturbo = "Alcalosi respiratoria con compenso metabolico secondario";            //Discordanza con pH aumentato è alcalosi respiratoria con compenso metabolico secondario

    document.getElementById("risultato").innerHTML =  "<div class=\"mb-3 ml-3\">\
                                                    <span style=\"color:red;\">Nuovo Dosaggio Settimanale:</span> " +  doseFinale + " mg\
                                                    - ( " + numeroNuovePasticche + " compresse settimanali)" + "<br>\
                                                    <span style=\"color:gray;\">Dosaggio Precedente: " +  doseAttuale + " mg\
                                                    - ( " + numeroPasticcheAttuali + " compresse settimanali) </div>\
                                                    <div class=\"ml-5\"> \
                                                    " + "Lunedì: " + frasario[0] + "<br>\
                                                    <span style=\"color:gray;\">Martedì: " + frasario[1] + "</span><br>\
                                                    Mercoledì: " + frasario[2] + "<br>\
                                                    <span style=\"color:gray;\">Giovedì: " + frasario[3] + "</span><br>\
                                                    Venerdì: " + frasario[4] + "<br>\
                                                    <span style=\"color:gray;\">Sabato: " + frasario[5] + "</span><br>\
                                                    Domenica: " + frasario[6] + "<div>";
}