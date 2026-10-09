import json
PDF = "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
C = lambda i, n: {"id": i, "verdict": "confirmado", "evidence_url": PDF, "notes": n}
v = []
v.append({
  "id": "extra-arrais-1-01", "verdict": "divergente", "evidence_url": PDF,
  "notes": "Os temas citados batem com os itens I a V, mas a alinea a) do item 3.1 tem itens I a X e as alineas b) a f) tratam de equipamentos, instrumentos, meteorologia, mares e RIPEAM; a lista esta incompleta. O ZIP mais novo (Anexo 5-A) mantem a) I-VIII e acrescenta b) a f) com conteudo semelhante, sem os itens de combustivel.",
  "correction": "O programa da prova de Arrais-Amador (Anexo 5-A, item 3.1) comeca por conhecimentos gerais (alinea a), itens I a X): termos nauticos e marinharia; manobras de fundeio, suspender, atracar, desatracar, pegar a boia e resgate de homem ao mar; preparacao da embarcacao (abastecimento, salvatagem, plano de navegacao); propulsao, leme e manobra com um/dois helices; identificacao de embarcacoes miudas; alem de prevencao e combate a incendio, pontos de ignicao e fulgor dos combustiveis, procedimento de abastecimento, primeiros socorros e tecnicas de sobrevivencia. As alineas b) a f) cobrem equipamentos de salvatagem, instrumentos nauticos e eletronicos, meteorologia, mares e RIPEAM.",
  "evidence_quote": "VI) prevenção e combate a incêndio, incluindo a identificação e manuseio correto de extintores; VII) pontos de ignição e de fulgor dos combustíveis (gasolina, etanol e diesel); VIII) procedimento para abastecimento de embarcação; IX) primeiros socorros e pronto atendimento; e X) técnicas básicas para a sobrevivência e segurança no mar, em rios, lagos e lagoas.  b) Equipamentos de salvatagem, segurança e sobrevivência no mar..."
})
v.append(C("extra-arrais-1-02", "Item 2.1 da Parte Pratica (Anexo 5-A, Secao II) confere no PDF e no ZIP mais novo; o ZIP removeu o item 2.8 (abastecimento), que a afirmacao nao cita."))
v.append(C("extra-arrais-1-03", "Itens 2.4 a 2.6 conferem; 'areas seletivas' e paráfrase sem mudanca de sentido, presente igual no ZIP."))
v.append(C("extra-arrais-1-04", "Item 2.7 confere literalmente no PDF e no ZIP."))
v.append(C("extra-arrais-1-05", "Anexo 5-F tem os tres titulos (antes de iniciar, durante, ao regressar) no PDF e no ZIP; identico."))
v.append(C("extra-arrais-1-06", "Itens 01 a 03 do Anexo 5-F conferem literalmente."))
v.append(C("extra-arrais-1-07", "Item 04 do Anexo 5-F confere literalmente (casco, bombas, luzes, VHF/HF, baterias, oleo, combustivel, vazamentos)."))
v.append(C("extra-arrais-1-08", "Item 05 do Anexo 5-F confere, incluindo a Regra do 1/3."))
v.append(C("extra-arrais-1-09", "Item 06 confere; a lista traz o endereco antigo www.dhn.mar.mil.br, mas a afirmacao nao cita URL."))
v.append(C("extra-arrais-1-10", "Item 07 confere; 'hora prevista de retorno' parafraseia 'quando pretende retornar', sem mudanca de sentido."))
v.append(C("extra-arrais-1-11", "Item 08 do Anexo 5-F confere (Tribunal Maritimo, esferas civil e penal, lotacao maxima)."))
v.append(C("extra-arrais-1-12", "Item 09 do Anexo 5-F confere (200 m); a faixa de 100/200 m do art. 1.8.1 e regra separada e nao altera a afirmacao."))
v.append(C("extra-arrais-1-13", "Itens 10 a 12 do Anexo 5-F conferem literalmente."))
v.append(C("extra-arrais-1-14", "Item 13 do Anexo 5-F confere, incluindo a ressalva sobre propulsores ao suspender."))
v.append(C("extra-arrais-1-15", "Itens 14 e 15 do Anexo 5-F conferem."))
v.append(C("extra-arrais-1-16", "Art. 4.6.1 confere: aviso obrigatorio, chegada comunicada, NAVSEG informa marina/clube e a Marinha, recomendacao veemente."))
v.append(C("extra-arrais-1-17", "Art. 4.6.2 confere literalmente."))
v.append(C("extra-arrais-1-18", "Art. 4.6.3 confere (previsoes antes de sair; sinais de mau tempo durante o passeio)."))
v.append(C("extra-arrais-1-19", "Art. 4.6.5 confere: CP/DL/AG com Anexo 4-A ou registro no NAVSEG, para nao filiados."))
v.append(C("extra-arrais-1-20", "Anexo 4-A (PDF e ZIP) confere: campos listados, entrega ao clube/marina antes da saida ou via radio, pode ir a pessoa de confianca."))
v.append(C("extra-arrais-1-21", "Art. 1.8.1 a) confere: linha de arrebentacao nas praias litoraneas; espelho d'agua junto as margens em rios, lagos e lagoas."))
v.append(C("extra-arrais-1-22", "Art. 1.8.1 confere: fundeio permitido se a autoridade local nao proibir; salvamento (ex. Corpo de Bombeiros) isento das restricoes."))
v.append(C("extra-arrais-1-23", "Arts. 1.8.2 e 1.8.5 conferem: NPCP/NPCF define limites; extremidade navegavel das praias com fundeio so pelo tempo minimo."))
v.append(C("extra-arrais-1-24", "Tabela do art. 4.33 (navegacao interior), item 08: coletes classes III ou V para miudas e medio porte, classe III para grande porte. Conferido na tabela lida no PDF, pois a checagem automatica nao achou o trecho."))
v.append(C("extra-arrais-1-25", "Tabela 4.33, item 05: miudas dispensadas; medio porte 01 boia se <12 m, 02 se >=12 m, uma com retinida flutuante. Conferido na tabela lida no PDF."))
v.append(C("extra-arrais-1-26", "Tabela 4.33, itens 01-04 e 11: miudas dispensadas; medio porte obrigatorios (agulha, ancora 20 m, apito, bandeira, lanterna 01 un.). Conferido na tabela."))
v.append(C("extra-arrais-1-27", "Tabela 4.33, itens 06 e 09: medio porte obrigatorios (bomba de esgoto; extintor ref. art. 4.36), miudas dispensadas. Conferido na tabela."))
v.append(C("extra-arrais-1-28", "Tabela 4.33, itens 13, 17 e 20: luzes RIPEAM Parte C obrigatorias para miudas em navegacao noturna; VHF recomendado no medio porte; pirotecnicos dispensados para miudas e medio. Conferido na tabela."))
v.append(C("extra-arrais-1-29", "Tabela 4.33, item 15: primeiros socorros obrigatorios para medio e grande porte a partir de 15 pessoas a bordo; miudas dispensadas. Conferido na tabela."))
v.append(C("extra-arrais-1-30", "Anexo 4-B, item 4.1 (PDF e ZIP) confere: vapores de gasolina podem explodir na partida; recomenda ventilacao de motor e tanque; ventilacao por pelo menos 4 minutos antes da partida."))
ids = [x["id"] for x in v]
assert len(v) == 30 and len(set(ids)) == 30
out = {"verdicts": v}
p = "/home/sobranceiro/veleiro_certificacoes/research/_work/verify_extra_arrais-1_0_fonte.json"
json.dump(out, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(p)
