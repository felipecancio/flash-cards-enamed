/** Frentes curtas e justificativa de uma frase. A resposta continua sendo o gabarito da fonte. */
export const CLINICAL_REVIEW = new Set([39, 47, 48, 109, 140, 142]);

export const copy = {
  1: {
    front:
      "Cetoacidose com potássio de 3,1 mmol/L e reposição volêmica já iniciada. Qual é o próximo passo?",
    why: "Com potássio de 3,1 mmol/L, a hipocalemia muda a ordem do tratamento.",
  },
  2: {
    front:
      "Dor torácica há 2 horas, com supra de ST em DII, DIII e aVF; a angioplastia primária levaria cerca de 4 horas e não há contraindicação à fibrinólise. Qual é a estratégia inicial?",
    why: "Há 2 horas de dor, sem contraindicação, e a angioplastia só em cerca de 4 horas.",
  },
  4: {
    front:
      "Afasia e hemiparesia há 90 minutos, com glicemia normal, tomografia sem hemorragia e pressão controlada. Qual é a decisão?",
    why: "O déficit é incapacitante, o início é recente e a imagem não mostrou sangramento.",
  },
  6: {
    front:
      "Dispneia súbita, síncope e PA de 78/46 mmHg, com tromboembolismo pulmonar extenso confirmado, disfunção de ventrículo direito e sem contraindicação a fibrinolítico. Qual é a conduta?",
    why: "A hipotensão persistente coloca este tromboembolismo em alto risco.",
  },
  7: {
    front:
      "Fibrilação atrial a 170 bpm, com confusão e PA de 75/42 mmHg. Qual é a conduta imediata?",
    why: "Há taquicardia com hipotensão e alteração do estado mental.",
  },
  8: {
    front:
      "Potássio de 7,2 mmol/L, com QRS alargado e ondas T apiculadas. O que priorizar enquanto se organiza a redução do potássio?",
    why: "O eletrocardiograma mostra alteração ameaçadora.",
  },
  11: {
    front:
      "Suspeita de meningite bacteriana e a punção do líquor vai atrasar. Qual é a conduta?",
    why: "A suspeita é forte e o atraso do líquor não pode segurar o antibiótico.",
  },
  12: {
    front:
      "Glicemia de 34 mg/dL, com confusão, sudorese e deglutição insegura, e há acesso venoso. Qual é a medida inicial?",
    why: "A consciência está alterada e a via oral não é segura.",
  },
  13: {
    front:
      "Urticária, chiado, edema de lábios e PA de 82/45 mmHg minutos após um alimento novo. Qual é a primeira medicação específica?",
    why: "Pele, respiração e circulação foram comprometidas logo após a exposição.",
  },
  15: {
    front:
      "Convulsão com sódio de 112 mmol/L, glicemia normal e sem outra causa imediata. Qual é a medida inicial específica?",
    why: "O sintoma neurológico é grave e a hiponatremia é profunda.",
  },
  21: {
    front:
      "Glicemia de jejum de 132 mg/dL, sem sintomas e sem outro teste alterado. Qual é o próximo passo diagnóstico?",
    why: "Sem sintomas, um único resultado anormal ainda não fecha o diagnóstico.",
  },
  23: {
    front:
      "TFG de 52 mL/min/1,73 m² depois de uma gastroenterite; há seis meses a TFG era normal. O que ajudaria a classificar doença renal crônica?",
    why: "A queda surgiu numa doença aguda e ainda não tem duração documentada.",
  },
  24: {
    front:
      "Pressão repetidamente alta no consultório e medidas domiciliares padronizadas abaixo do limiar, sem sintomas. Como esclarecer essa diferença?",
    why: "A pressão do consultório pode não representar a pressão habitual.",
  },
  26: {
    front: "Cansaço, com TSH elevado e T4 livre baixo. Qual é a interpretação?",
    why: "TSH alto com T4 livre baixo é o padrão bioquímico desse quadro.",
  },
  27: {
    front:
      "Parestesias, perda da sensibilidade vibratória, anemia macrocítica e B12 baixa. Qual decisão evita a progressão neurológica?",
    why: "A deficiência já se manifesta no sangue e nos nervos, e folato isolado não a resolve.",
  },
  29: {
    front:
      "Fibrilação atrial persistente aos 76 anos, com hipertensão e AVC isquêmico antigo, e a frequência já está controlada. O que não pode faltar no plano?",
    why: "Idade e AVC prévio marcam alto risco, e controlar o pulso não cobre a prevenção do evento.",
  },
  30: {
    front:
      "Tabagista com tosse e dispneia progressivas; o exame inicial sugere DPOC. Que teste confirma obstrução persistente?",
    why: "Sintomas e tabagismo levantam a suspeita, mas não fecham o diagnóstico.",
  },
  35: {
    front:
      "Urocultura positiva em exame de rotina, sem sintomas urinários, sem gravidez e sem procedimento urológico invasivo. Como interpretar?",
    why: "Nesse contexto, cultura positiva não significa infecção a tratar.",
  },
  39: {
    front:
      "Sódio 140, cloro 100 e bicarbonato 12 mmol/L, com albumina normal. Qual é o ânion gap, sem ajuste pela albumina?",
    why: "O cálculo usa sódio menos cloro e bicarbonato, sem correção pela albumina.",
  },
  40: {
    front:
      "Poliúria, polidipsia e perda de peso, com glicemia casual de 263 mg/dL. Como interpretar?",
    why: "Há sintomas típicos junto com hiperglicemia casual inequívoca.",
  },
  41: {
    front:
      "Obstrução de delgado com ponto de transição, sinais de hipoperfusão, defesa e dor à descompressão, após laparotomia antiga. Qual é a conduta?",
    why: "Há peritonismo e possível isquemia, então o manejo só conservador não cabe.",
  },
  43: {
    front:
      "Apendicite com taquicardia, peritonite difusa e pneumoperitônio. Qual é a conduta?",
    why: "Há perfuração com peritonite difusa, e o tratamento não é ambulatorial.",
  },
  46: {
    front:
      "Dor súbita na perna, palidez, ausência de pulso e parestesia, em quem tem fibrilação atrial e não tem contraindicação à anticoagulação. Qual é o próximo passo?",
    why: "Dor súbita, perda de pulso e parestesia caracterizam isquemia aguda ameaçadora.",
  },
  47: {
    front:
      "Diverticulite localizada na tomografia, sem abscesso, em pessoa imunocompetente, estável, que tolera líquidos e pode retornar. Qual é a orientação sobre antibiótico?",
    why: "A inflamação está restrita e a pessoa permanece estável.",
  },
  48: {
    front:
      "Diverticulite com coleção pericólica de 6 cm, acessível, sem peritonite difusa, em pessoa estável. Qual é a melhor estratégia?",
    why: "Nesta coleção, o tamanho e o acesso permitem avaliar drenagem.",
  },
  49: {
    front:
      "Dor desproporcional na perna, bolhas, progressão rápida, febre e hipotensão, em pessoa com diabetes. Qual é a decisão?",
    why: "A suspeita é infecção necrosante, e o tempo até o desbridamento faz parte do tratamento.",
  },
  50: {
    front:
      "Após trauma, dispneia intensa, hipotensão, murmúrio ausente à direita e distensão jugular, sem radiografia imediata. Qual é a conduta?",
    why: "O quadro é de pneumotórax hipertensivo, e a imagem não deve atrasar o alívio.",
  },
  54: {
    front:
      "Febre, dor no hipocôndrio direito, icterícia, confusão e hipotensão, com colédoco dilatado; suporte e antibiótico já começaram. Qual intervenção controla a fonte?",
    why: "Há infecção biliar obstrutiva com disfunção orgânica.",
  },
  55: {
    front:
      "Volvo de sigmoide, estável, sem peritonite, pneumoperitônio ou isquemia. Qual é a primeira intervenção?",
    why: "O volvo está estável, sem peritonite nem isquemia.",
  },
  59: {
    front:
      "Dor escrotal súbita há duas horas, náusea, testículo elevado e reflexo cremastérico ausente, com equipe cirúrgica disponível. Qual é a conduta?",
    why: "A suspeita clínica de torção é alta, e o tempo de isquemia manda na decisão.",
  },
  63: {
    front:
      "Cálculos na vesícula vistos por acaso, sem cólica, febre ou alteração biliar, e sem fatores especiais. Qual conduta geral cabe?",
    why: "O achado foi incidental e não há sintoma biliar.",
  },
  64: {
    front:
      "Mudança persistente do hábito intestinal, anemia ferropriva e sangue visível nas fezes, em pessoa estável. Qual investigação organizar?",
    why: "Há sintomas, então o caminho é diagnóstico e não um teste de rastreamento.",
  },
  68: {
    front:
      "Antes da anestesia, a lateralidade do joelho no agendamento diverge do consentimento. Qual é a decisão?",
    why: "Divergência de paciente, procedimento ou lado pede pausa antes de seguir.",
  },
  70: {
    front:
      "Horas após laparotomia: taquicardia, hipotensão e dreno com sangue vivo crescente. Qual é a prioridade?",
    why: "Instabilidade com sangramento ativo pede ação antes de hemoglobina de controle.",
  },
  71: {
    front:
      "Gestação de 35 semanas, PA de 172/114 mmHg confirmada, cefaleia intensa e turvação visual, sem convulsão e com batimentos fetais. Qual é a conduta?",
    why: "A pressão está em faixa grave e há sintomas neurológicos.",
  },
  72: {
    front:
      "Atraso menstrual de sete semanas, teste de gravidez positivo, dor súbita, desmaio, PA de 82/48 mmHg, FC de 128 bpm e líquido livre. Qual é a conduta?",
    why: "Gravidez com choque e líquido livre sugere hemorragia por ectópica rota.",
  },
  73: {
    front:
      "Gestação de 32 semanas, sangramento vermelho vivo sem dor, estável, e um ultrassom antigo sugeriu placenta baixa. Qual é a abordagem inicial?",
    why: "No sangramento da segunda metade, a posição da placenta vem antes do toque.",
  },
  74: {
    front:
      "Gestação de 36 semanas, dor súbita, sangramento escuro, útero endurecido e sofrimento fetal. Qual é a prioridade?",
    why: "Dor e hipertonia com sangramento sugerem descolamento de placenta.",
  },
  75: {
    front:
      "Gestação de 34 semanas, hipertensão grave e convulsão, depois de proteger a via aérea. Qual fármaco priorizar?",
    why: "A convulsão no contexto de pré-eclâmpsia caracteriza eclâmpsia.",
  },
  76: {
    front:
      "Minutos após o parto, sangramento abundante e útero aumentado e amolecido. Qual é o conjunto inicial?",
    why: "Sangramento com útero flácido indica atonia.",
  },
  81: {
    front:
      "Sangramento depois das relações e lesão irregular e friável no colo, sem rastreamento recente. Qual é a próxima etapa?",
    why: "Lesão visível pede investigação diagnóstica, não apenas rastreamento.",
  },
  83: {
    front:
      "Dor pélvica súbita e vômitos, ovário aumentado e fluxo ao Doppler ainda presente, com suspeita alta de torção. Qual é a conduta?",
    why: "A clínica de torção prevalece sobre um Doppler isolado tranquilizador.",
  },
  84: {
    front:
      "Sangramento uterino intenso fora do período habitual, em pessoa estável e sem diagnóstico prévio. Qual exame inicial é indispensável?",
    why: "Em idade reprodutiva, gestação precisa ser excluída antes de outros rótulos.",
  },
  85: {
    front:
      "Onze anos sem menstruar e um episódio novo de sangramento, com endométrio de 9 mm, em pessoa estável. Qual é a próxima etapa?",
    why: "Sangramento após a menopausa pede avaliação, mesmo quando o episódio é único.",
  },
  87: {
    front:
      "Gestação de 30 semanas, contrações regulares, mudança cervical e parto provável em 24 horas, com membranas íntegras e sem contraindicação. Que medida fetal considerar?",
    why: "Com 30 semanas, ainda há janela para maturação pulmonar e neuroproteção.",
  },
  89: {
    front:
      "Gestação de 20 semanas, testes treponêmico e VDRL reagentes, sem tratamento prévio, e alergia imediata à penicilina. Qual é o plano?",
    why: "Na gestação, a penicilina é o tratamento que também alcança a infecção fetal.",
  },
  90: {
    front:
      "Gestação de 15 semanas, sem disúria ou febre, e urocultura adequada com um uropatógeno em crescimento significativo. Qual é a conduta?",
    why: "Na gestação, bacteriúria confirmada muda a decisão mesmo sem sintomas.",
  },
  92: {
    front:
      "Sem fatores de risco especiais, planeja engravidar em dois meses e pede prevenção de defeito do tubo neural. Qual medida farmacológica cabe?",
    why: "A prevenção começa antes da concepção, e a dose muda quando há risco especial.",
  },
  93: {
    front:
      "Gestação de 25 semanas, sem hipertensão prévia, PA de 146/94 mmHg confirmada e sem sintomas graves. Qual é o próximo eixo?",
    why: "A pressão nova após 20 semanas está em faixa hipertensiva, sem gravidade imediata.",
  },
  98: {
    front:
      "Enxaqueca com aura e pedido de pílula combinada com estrogênio. Qual orientação é mais segura?",
    why: "A aura muda a elegibilidade para o estrogênio.",
  },
  101: {
    front:
      "Ciclos espaçados e hiperandrogenismo, com pedido de investigação para ovários policísticos. Que cuidado evita um diagnóstico apressado?",
    why: "O diagnóstico pede critérios e a exclusão de outras causas relevantes.",
  },
  102: {
    front:
      "Dismenorreia incapacitante e dor pélvica cíclica, sem massa, com gravidez negativa, e sem desejo de cirurgia agora. O que pode começar na atenção primária?",
    why: "A dor cíclica sugestiva pode ser abordada de início sem cirurgia.",
  },
  105: {
    front:
      "Gestação de 26 semanas, hemoglobina baixa e VCM baixo, sem sangramento ativo. O que fazer antes de atribuir isso só à gestação?",
    why: "Anemia microcítica não se explica apenas pela hemodiluição.",
  },
  106: {
    front:
      "Criança de 18 meses com diarreia há dois dias, irritada, com olhos fundos, sede, prega lenta, consciente e conseguindo beber, sem choque. Qual é a conduta inicial?",
    why: "Há sinais de desidratação, com capacidade de beber e sem choque.",
  },
  108: {
    front:
      "Recém-nascido a termo com 16 horas de vida, icterícia até o tórax, mamando, e incompatibilidade sanguínea em gestação anterior. Qual é a conduta inicial?",
    why: "Icterícia nas primeiras 24 horas pede medida objetiva e investigação.",
  },
  109: {
    front:
      "Lactente de 15 dias, a termo, com temperatura retal de 38,2 °C, corado e mamando, sem foco evidente. Qual é a conduta?",
    why: "Nessa idade, a febre documentada pesa mais do que a boa aparência.",
  },
  112: {
    front:
      "Febre há seis dias, conjuntivite sem secreção, lábios fissurados, língua em framboesa, edema de mãos e linfonodo cervical. Qual é a conduta?",
    why: "Febre por pelo menos cinco dias, com esses sinais mucocutâneos, sugere Kawasaki.",
  },
  113: {
    front:
      "Lactente de nove meses, com crises de choro, flexão das pernas, vômitos e sonolência; o ultrassom mostra invaginação ileocólica, sem peritonite. Qual é o tratamento inicial?",
    why: "A invaginação está confirmada e não há peritonite que impeça a redução.",
  },
  114: {
    front:
      "Criança de quatro anos, com vacinação incompleta, febre alta, sialorreia, voz abafada, estridor e posição inclinada para frente, piorando ao deitar. Qual é a prioridade?",
    why: "O quadro sugere obstrução supraglótica, e a via aérea vem antes da confirmação.",
  },
  118: {
    front:
      "Criança de sete anos, não vacinada, com febre, tosse, coriza, conjuntivite e exantema da face para o tronco, vinda de área com transmissão. Qual é a ação inicial de saúde pública?",
    why: "A clínica e o vínculo epidemiológico tornam a suspeita relevante, e a ação não espera confirmação.",
  },
  121: {
    front:
      "Recém-nascido de três dias, com cianose progressiva e ecocardiograma mostrando atresia pulmonar dependente do canal arterial. Que medida inicial sustenta o fluxo?",
    why: "O fluxo pulmonar dessa lesão depende do canal arterial.",
  },
  122: {
    front:
      "Criança de 20 meses, letárgica, com olhos muito fundos, incapaz de beber, prega muito lenta e perfusão ruim, após diarreia e vômitos. Qual é a conduta?",
    why: "A criança não consegue beber e a perfusão está comprometida.",
  },
  123: {
    front:
      "Recém-nascido de 18 horas, mãe com febre no parto, mamando mal, com hipotermia, taquipneia e perfusão lenta. Qual é a abordagem inicial?",
    why: "Há risco materno e sinais de doença sistêmica, e o bebê pode esfriar em vez de febre.",
  },
  124: {
    front:
      "Lactente de quatro meses com bronquiolite, tiragem moderada, SpO2 de 88% persistente e ingestão abaixo da metade do habitual. Qual é a conduta?",
    why: "A hipoxemia persiste e a alimentação não se sustenta.",
  },
  125: {
    front:
      "Criança de cinco anos, febril, sonolenta e hipotensa, com manchas que não desaparecem à pressão. Qual é a prioridade?",
    why: "Púrpura e choque com febre sugerem doença meningocócica, e o tratamento não espera o laboratório.",
  },
  128: {
    front:
      "Bebê saudável de três meses, que mama bem e cresce de modo adequado. Deve-se oferecer água nos dias quentes?",
    why: "Até os seis meses, o leite materno cobre a hidratação de rotina.",
  },
  129: {
    front:
      "Bebê saudável que completa seis meses, senta com apoio, interessa-se pela comida e segue mamando. O que orientar sobre a alimentação?",
    why: "Aos seis meses, só o leite já não supre todas as necessidades.",
  },
  130: {
    front:
      "Criança de três anos com doses faltantes na caderneta, depois de mudar de cidade. Como atualizar o esquema?",
    why: "Doses comprovadas continuam válidas, e o atraso não apaga o que já foi recebido.",
  },
  133: {
    front:
      "Criança de dois anos, crise generalizada de três minutos durante a febre, volta ao habitual, com exame neurológico normal e sem sinais meníngeos. O que evita investigação excessiva?",
    why: "A crise foi breve, única e generalizada, com recuperação completa.",
  },
  140: {
    front:
      "Triagem auditiva neonatal alterada em uma orelha; a família diz que o bebê reage a ruídos. O que é apropriado?",
    why: "Falha na triagem pede confirmação, mesmo quando o bebê parece ouvir.",
  },
  141: {
    front:
      "Criança de três anos, assintomática, mora com um adulto com tuberculose pulmonar confirmada. Qual é o passo na investigação desse contato?",
    why: "No contato domiciliar de menor de cinco anos, o primeiro passo é excluir doença ativa.",
  },
  142: {
    front:
      "Exposições sexuais repetidas, preservativo inconsistente, sem exposição de risco nas últimas 72 horas, assintomático e com teste de HIV negativo no serviço. Qual é a abordagem preventiva?",
    why: "O risco é continuado e não houve exposição recente que peça profilaxia pós-exposição.",
  },
  143: {
    front:
      "Tosse há quatro semanas, sudorese noturna, perda de peso e infiltrado apical, em pessoa estável, com teste molecular disponível. Qual é a estratégia diagnóstica inicial?",
    why: "Sintomas prolongados e a imagem tornam tuberculose pulmonar provável e pedem confirmação microbiológica.",
  },
  145: {
    front:
      "PA de 148/92 mmHg depois de subir escadas, sem sintomas, sem lesão de órgão-alvo e sem emergência. Qual é a conduta diagnóstica?",
    why: "Uma medida isolada, fora de emergência, não encerra o diagnóstico.",
  },
  148: {
    front:
      "Depois da alta, usa receitas antigas junto com as novas e há anti-hipertensivo em dose duplicada. Que ação reduz o risco?",
    why: "A alta deixou a receita antiga junto da nova, com dose duplicada.",
  },
  149: {
    front:
      "Aos 81 anos, usa benzodiazepínico todas as noites há anos, caiu duas vezes e teme suspender o remédio. Qual é a proposta inicial?",
    why: "O sedativo crônico pode contribuir para as quedas, e a retirada costuma ser gradual.",
  },
  150: {
    front:
      "Aos 79 anos, três quedas em seis meses, sem perda de consciência, em uso de sedativo, com medo de caminhar e tapetes soltos em casa. Qual avaliação é mais útil?",
    why: "As quedas são repetidas e há vários fatores que podem ser modificados.",
  },
  152: {
    front:
      "Lombalgia mecânica há cinco dias, sem febre, trauma, déficit neurológico ou alteração de esfíncteres, com pedido de ressonância hoje. Qual resposta cabe?",
    why: "Não há sinal de alarme, então o início é clínico, com reavaliação se persistir.",
  },
  157: {
    front:
      "Relato de agressões do companheiro e medo de voltar para casa; ele espera do lado de fora e hoje não há ferimento grave. Qual é a prioridade?",
    why: "Há medo concreto da volta ao domicílio, e a conversa precisa ocorrer em privacidade.",
  },
  159: {
    front:
      "O laudo mostra potássio muito elevado, com alerta do laboratório, e a equipe ainda não viu o resultado. O que é prioritário?",
    why: "Resultado crítico pode exigir decisão antes da consulta marcada.",
  },
  161: {
    front:
      "Acidente com agulha há quatro horas, paciente-fonte com HIV e carga viral detectável, teste basal negativo e sem profilaxia pré-exposição. Qual é a conduta para o HIV?",
    why: "As quatro horas ainda estão dentro das 72 horas em que a profilaxia pode começar.",
  },
  163: {
    front:
      "Acordou com um morcego no quarto e um arranhão na mão; o animal fugiu e não poderá ser analisado. Qual é a conduta?",
    why: "Houve contato com morcego e lesão, sem chance de observar ou testar o animal.",
  },
  165: {
    front:
      "Em 2.000 pessoas inicialmente livres da doença, surgiram 40 casos novos em um ano, sem perdas. Qual foi a incidência acumulada?",
    why: "A conta divide os casos novos pela população que estava em risco no início do período.",
  },
  167: {
    front:
      "Entre 100 pessoas com a doença, o teste foi positivo em 92 e negativo em oito. Que propriedade isso estima?",
    why: "A conta olha apenas quem tinha a doença e vê a fração que testou positivo.",
  },
  168: {
    front:
      "Entre 200 pessoas sem a doença, 180 testes foram negativos e 20 foram positivos. Qual propriedade é diretamente estimável?",
    why: "A conta olha apenas quem não tinha a doença e vê a fração que testou negativo.",
  },
  169: {
    front:
      "De 100 testes positivos, 25 foram confirmados e 75 não tinham a doença. Qual é o valor preditivo positivo?",
    why: "A conta parte de quem testou positivo e vê quantos realmente tinham a doença.",
  },
  170: {
    front:
      "Em um ano, o desfecho ocorreu em 10% do grupo controle e em 5% dos tratados, com grupos comparáveis e seguimento completo. Qual é o número necessário para tratar e evitar um evento?",
    why: "O cálculo usa a diferença absoluta entre esses riscos, no horizonte de um ano.",
  },
  171: {
    front:
      "Um estudo achou associação entre café e câncer de pulmão, e quem bebia café fumava mais. Qual ameaça à interpretação causal é a mais imediata?",
    why: "O fumo se associa ao café e é causa conhecida do desfecho.",
  },
  173: {
    front:
      "Das 150 pessoas que comeram a sobremesa, 60 adoeceram em 24 horas, sem perdas. Qual foi a taxa de ataque nesse grupo?",
    why: "O denominador é o grupo que consumiu o alimento em investigação.",
  },
  174: {
    front:
      "Febre, exantema e tosse depois de uma região com transmissão de sarampo; a sorologia foi colhida e o resultado sai em alguns dias. Que ação de vigilância ocorre agora?",
    why: "A suspeita clínica e epidemiológica já aciona a vigilância.",
  },
  181: {
    front:
      "Diz que pretende morrer agora, com plano definido e acesso imediato aos meios, está orientado e aceita conversar. Qual é a conduta inicial?",
    why: "Intenção atual, plano e meios acessíveis pedem resposta imediata em ambiente seguro.",
  },
  182: {
    front:
      "Tristeza e anedonia há um mês; antes, passou uma semana quase sem dormir, com energia elevada, gastos excessivos e prejuízo no trabalho. O que investigar antes de prescrever?",
    why: "Houve um período de mais energia, menos sono e prejuízo funcional, e isso muda a hipótese.",
  },
  184: {
    front:
      "Uso diário intenso de álcool, parou há 20 horas e agora tem tremor, sudorese, taquicardia e ansiedade; está orientado e não há outra causa evidente. Qual é a abordagem farmacológica de primeira linha, quando indicada?",
    why: "A síndrome autonômica surgiu depois da cessação recente do álcool.",
  },
  185: {
    front:
      "Encontrado sonolento, com seis incursões respiratórias por minuto e pupilas puntiformes, e há suspeita de opioide. Qual é a conduta imediata?",
    why: "A depressão respiratória, nesse contexto, ameaça a vida.",
  },
  186: {
    front:
      "Idosa internada, antes orientada, agora desatenta e alternando sonolência e agitação, com medicamentos novos e febre. Qual é a abordagem?",
    why: "O início foi agudo, o quadro flutua e a atenção está comprometida.",
  },
  187: {
    front:
      "Dez dias após o parto, quase não dorme, fala de modo desorganizado e diz ouvir vozes que mandam afastar o bebê. Qual é a conduta?",
    why: "Sintomas psicóticos de início agudo no puerpério pedem proteção imediata.",
  },
  189: {
    front:
      "Aos 17 anos, restrição alimentar importante, perda rápida de peso, frequência cardíaca de 38 bpm em repouso, tontura ao levantar e alterações eletrolíticas. Qual é a conduta?",
    why: "Bradicardia marcada e distúrbio eletrolítico indicam risco clínico agudo.",
  },
  191: {
    front:
      "Tristeza, perda de prazer e insônia há seis semanas, com a frase de que seria melhor não acordar, e ainda ninguém perguntou sobre plano. Qual é o próximo passo?",
    why: "A frase sugere ideação e pede uma avaliação direta do risco.",
  },
  194: {
    front:
      "Pensamentos repetidos de contaminação, reconhecidos como exagerados, e lavagem das mãos por uma hora para aliviar a ansiedade, sem vozes. Qual é a hipótese mais provável?",
    why: "O pensamento é intrusivo, reconhecido como excessivo, e o ritual tenta aliviar a ansiedade.",
  },
  198: {
    front:
      "Pede estimulante depois de ver conteúdo sobre TDAH; a distração é recente, com trabalho noturno e sono pior. Que informação pesa mais na avaliação?",
    why: "O início é recente e o sono piorou, então a história desde a infância decide o diagnóstico.",
  },
};

/** Resposta em português clínico do Brasil. Onde não há entrada, permanece o gabarito da fonte. */
export const answers = {
  2: "Tenecteplase ou alteplase agora e transferência para hemodinâmica.",
  4: "Alteplase venoso agora e pesquisar oclusão de grande artéria.",
  6: "Alteplase e heparina não fracionada.",
  8: "Gluconato de cálcio intravenoso, pelo eletrocardiograma alterado.",
  11: "Hemoculturas e ceftriaxona venosa, sem esperar o líquor.",
  12: "Glicose a 50% intravenosa e reavaliar.",
  13: "Adrenalina intramuscular na face anterolateral da coxa.",
  15: "NaCl a 3% em bólus, pela convulsão.",
  24: "Confirmar com MAPA ou MRPA.",
  27: "Reposição parenteral de vitamina B12 e investigação da causa.",
  29: "Anticoagulação oral para prevenir novo AVC.",
  41: "Reposição volêmica e laparotomia de urgência.",
  43: "Reposição volêmica, antibiótico e laparotomia de urgência.",
  46: "Heparina não fracionada intravenosa e cirurgia vascular imediata.",
  50: "Toracocentese de alívio agora e, em seguida, drenagem pleural em selo d'água.",
  54: "CPRE de urgência para drenar a via biliar.",
  55: "Colonoscopia descompressiva, com cirurgia disponível.",
  59: "Exploração escrotal imediata, sem ultrassom.",
  70: "Reposição volêmica e reabordagem cirúrgica imediata.",
  71: "Anti-hipertensivo, sulfato de magnésio e parto após estabilizar.",
  72: "Reposição volêmica e laparotomia por ectópica rota.",
  73: "Avaliar a mãe e o feto e localizar a placenta antes do toque vaginal.",
  74: "Estabilizar a gestante e decidir o parto com urgência.",
  76: "Massagem uterina, ocitocina e reposição volêmica.",
  85: "Biópsia de endométrio.",
  87: "Betametasona para maturação pulmonar e sulfato de magnésio para neuroproteção fetal.",
  89: "Dessensibilizar e tratar com penicilina.",
  106: "Plano B com soro de reidratação oral na unidade e reavaliar.",
  109: "Internar para investigar infecção grave.",
  112: "Ecocardiograma e imunoglobulina humana intravenosa.",
  113: "Redução pneumática ou hidrostática, com cirurgia disponível.",
  114: "Manter a criança sentada e acionar a equipe de via aérea.",
  118: "Precaução para aerossóis e notificação imediata.",
  121: "Alprostadil para manter o canal arterial aberto.",
  122: "Plano C: reidratação venosa e reavaliar.",
  123: "Hemoculturas e ampicilina com gentamicina venosas.",
  124: "Internar para oxigênio e hidratação.",
  125: "Expansão volêmica e ceftriaxona venosa imediatas.",
  140: "Repetir a triagem e encaminhar à avaliação audiológica.",
  141: "Afastar tuberculose ativa e indicar tratamento da ILTB.",
  143: "Coletar escarro para TRM-TB.",
  148: "Fazer a conciliação medicamentosa com a prescrição da alta.",
  159: "Comunicar o resultado crítico e garantir o retorno para conduta.",
  161: "PEP com tenofovir, lamivudina e dolutegravir por 28 dias.",
  184: "Diazepam monitorado e suporte.",
};
