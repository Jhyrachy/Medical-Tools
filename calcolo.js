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
    var frasario = ["","","","","","",""];
    var doseQ = [0,0,0,0,0,0,0];
    var doseI = [0,0,0,0,0,0,0];
    
    cleanAnswer();

    var distribuzioneUno        = [0,0,0,1,0,0,0];
    var distribuzioneDue        = [0,1,0,0,0,1,0];
    var distribuzioneTre        = [0,1,0,1,0,1,0];
    var distribuzioneQuattro    = [1,0,1,0,1,0,1];
    var distribuzioneCinque     = [1,1,0,1,0,1,1];
    var distribuzioneSei        = [1,1,1,0,1,1,1];

    var nuovodDosaggio;

    //calcolo variazione dosaggio
    if(compareINR <= 1.3){
        nuovoDosaggio = percentage(1, doseAttuale, 50);
    }
    if(compareINR > 1.3 && compareINR < 1.5){
        nuovoDosaggio = percentage(1, doseAttuale, 33);
    }
    if(compareINR >= 1.5 && compareINR < 1.9){
        nuovoDosaggio = percentage(1, doseAttuale, 25);
    }
    if(compareINR >= 1.9 && compareINR < 2){
        nuovoDosaggio = percentage(1, doseAttuale, 10);
    }
    if(compareINR >= 2 && compareINR <= 2.8){
        nuovoDosaggio = doseAttuale;
    }
    if(compareINR > 2.8 && compareINR <= 3.1){
        nuovoDosaggio = percentage(0, doseAttuale, 10);
    }
    if(compareINR > 3.1 && compareINR <= 3.5){
        nuovoDosaggio = percentage(0, doseAttuale, 25);
    }
    if(compareINR > 3.5 && compareINR < 4){
        nuovoDosaggio = percentage(0, doseAttuale, 33);
        sospensione = 1;
    }
    if(compareINR >= 4 && compareINR < 4.5){
        nuovoDosaggio = percentage(0, doseAttuale, 33);
        sospensione = 2;
    }
    if(compareINR >= 4.5 && compareINR < 6){
        document.getElementById("terapia").innerHTML ="<span style=\"color:red;\">Assenza di emorragia</span><br>\
                                                        Sospendere la terapia per 1-2 giorni e poi ridurre il dosaggio di warfarinf di 1,25-2.5mg e controllare INR il prima possibile <br><br><br>\
                                                        <span style=\"color:red;\">Presenza di emorragia scarsamente significativa</span><br>\
                                                        Sospendere la terapia e somministrare vitamina-K 0,5-1mg per OS, ricontrollare INR entro 24 ore.\
                                                         Istruire il paziente a recarsi immediatamente in ospedale in caso di peggioramento dell'emorragia";
        return;
    }
    if(compareINR >= 6 && compareINR <= 10){
        document.getElementById("terapia").innerHTML ="In <span style=\"color:red;\">assenza di emorragia</span>, sospendere la terapia e somministrare vitamina-K 0,5-1mg per OS e ricontrollare INR dopo 24h;\
                                                         successivamente regolarsi in base ai valori di INR";
        return;
    }
    if(compareINR > 10){
        document.getElementById("terapia").innerHTML ="<span style=\"color:red;\">Valore fuori scala</span><br>Controllare di aver inserito i valori giusti.\
                                                         Nel caso, rivolgersi alla sede di competenza più vicina.";
        return;
    }

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
