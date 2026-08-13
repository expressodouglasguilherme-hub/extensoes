// Textos padrão para cada tipo de alerta
const TEXTOS_PADRAO = {
  // ATENÇÃO / DISTRAÇÃO
  'Atenção': [
    'Reportado para a operação. Condutor demonstrando desatenção ao ambiente de condução, desviando o foco da direção. Reforçar orientação sobre direção defensiva e foco total na condução.',
    'Reportado para a operação. Condutor identificado realizando alimentação durante a condução, o que compromete a atenção e o controle do veículo. Reforçar as diretrizes de segurança operacional.',
    'Foi identificado que o motorista está utilizando o rádio durante a condução em rodovia, sem necessidade aparente, o que vai contra a recomendação de uso apenas em cenários oportunos, como em estradas de terra. Essa condição compromete a capacidade de reação e aumenta significativamente o risco de acidentes.'
  ],
  
  'Distração': [
    'Reportado para a operação. Condutor demonstrando desatenção ao ambiente de condução, desviando o foco da direção. Reforçar orientação sobre direção defensiva e foco total na condução.',
    'Reportado para a operação. Condutor identificado realizando alimentação durante a condução, o que compromete a atenção e o controle do veículo. Reforçar as diretrizes de segurança operacional.',
    'Foi identificado que o motorista está utilizando o rádio durante a condução em rodovia, sem necessidade aparente, o que vai contra a recomendação de uso apenas em cenários oportunos, como em estradas de terra. Essa condição compromete a capacidade de reação e aumenta significativamente o risco de acidentes.'
  ],
  
  // CÂMERA COBERTA / CELULAR / CIGARRO / GESTOS OBSCENOS / CINTO DE SEGURANÇA / MÁSCARA
  'Conduta – Política de Consequência + Pontos no D-OLHO': [
    'Reportado para a operação. Câmera coberta, sem visualização de imagens. A ação infringe as normas de segurança da empresa e deve ser avaliada conforme a política disciplinar vigente.',
    'Reportado para a operação. Condutor identificado manipulando a câmera de monitoramento, comprometendo a captação adequada das imagens. A ação infringe as normas de segurança da empresa e deve ser avaliada conforme a política disciplinar vigente.',
    'Reportado para a operação Foi identificado que o motorista ao conduzir o veículo realizou gestos obscenos durante a sua condução, agindo sem ética. Essa conduta compromete a segurança operacional e vai contra as diretrizes da gestão de consequência.',
    'Reportado para a operação. Condutor identificado utilizando aparelho celular durante a condução, desrespeitando as normas internas de segurança e infringindo as diretrizes da empresa quanto ao comportamento em operação.',
    'Reportado para a operação. Motorista fumando durante sua condução. Infringindo as normas da Empresa.',
    'Reportado para a operação. Condutor identificado sem o cinto de segurança ou utilizando-o de forma incorreta, infringindo normas de segurança e legislação vigente. Reforçar obrigatoriedade do uso adequado do cinto em todas as viagens.',
    'Reportado para a operação. Caroneiro identificado sem o uso do cinto de segurança, colocando em risco sua integridade física e infringindo normas de segurança da empresa.',
    'Reportado para a operação, condutor colocou o cinto de segurança com a frota em movimento.',
    'Reportado para a operação. Condutor identificado utilizando máscara/balaclava cobrindo totalmente o rosto, impossibilitando a identificação facial e o monitoramento de fadiga.'
  ],
  
  'Conduta - Política de Consequência + Pontos no D-OLHO': [
    'Reportado para a operação. Câmera coberta, sem visualização de imagens. A ação infringe as normas de segurança da empresa e deve ser avaliada conforme a política disciplinar vigente.',
    'Reportado para a operação. Condutor identificado manipulando a câmera de monitoramento, comprometendo a captação adequada das imagens. A ação infringe as normas de segurança da empresa e deve ser avaliada conforme a política disciplinar vigente.',
    'Reportado para a operação Foi identificado que o motorista ao conduzir o veículo realizou gestos obscenos durante a sua condução, agindo sem ética. Essa conduta compromete a segurança operacional e vai contra as diretrizes da gestão de consequência.',
    'Reportado para a operação. Condutor identificado utilizando aparelho celular durante a condução, desrespeitando as normas internas de segurança e infringindo as diretrizes da empresa quanto ao comportamento em operação.',
    'Reportado para a operação. Motorista fumando durante sua condução. Infringindo as normas da Empresa.',
    'Reportado para a operação. Condutor identificado sem o cinto de segurança ou utilizando-o de forma incorreta, infringindo normas de segurança e legislação vigente. Reforçar obrigatoriedade do uso adequado do cinto em todas as viagens.',
    'Reportado para a operação. Caroneiro identificado sem o uso do cinto de segurança, colocando em risco sua integridade física e infringindo normas de segurança da empresa.',
    'Reportado para a operação, condutor colocou o cinto de segurança com a frota em movimento.',
    'Reportado para a operação. Condutor identificado utilizando máscara/balaclava cobrindo totalmente o rosto, impossibilitando a identificação facial e o monitoramento de fadiga.'
  ],
  
  // AUSÊNCIA - PROBLEMAS COM CÂMERA (APENAS OS 3 TEXTOS QUE DEVEM ADICIONAR GTE@)
  'Ausência': [
    'Reportado para a operação. Câmera identificada em posição desajustada ou deslocada, prejudicando a visualização adequada do condutor. Necessário ajuste imediato do equipamento para restabelecer o correto enquadramento e garantir a eficácia do monitoramento.',
    'Reportado para a operação. Imagem da câmera apresenta escurecimento excessivo, dificultando a visualização adequada do condutor.',
    'Reportado para a operação. Câmera do veículo apresentando falha/defeito, comprometendo a qualidade das imagens captadas.'
  ],
  
  'Ausência - Solicitar ajuste - Gestão de Equipamentos CCI': [
    'Reportado para a operação. Câmera identificada em posição desajustada ou deslocada, prejudicando a visualização adequada do condutor. Necessário ajuste imediato do equipamento para restabelecer o correto enquadramento e garantir a eficácia do monitoramento.',
    'Reportado para a operação. Imagem da câmera apresenta escurecimento excessivo, dificultando a visualização adequada do condutor.',
    'Reportado para a operação. Câmera do veículo apresentando falha/defeito, comprometendo a qualidade das imagens captadas.'
  ],
  
  // CELULAR
  'Celular': [
    'Reportado para a operação. Condutor identificado utilizando aparelho celular durante a condução, desrespeitando as normas internas de segurança e infringindo as diretrizes da empresa quanto ao comportamento em operação.'
  ],
  
  // CIGARRO
  'Cigarro': [
    'Reportado para a operação. Motorista fumando durante sua condução. Infringindo as normas da Empresa.'
  ],
  
  // BOCEJO
  'Bocejo': [
    'Reportado para a operação. Condutor identificado bocejando de forma recorrente durante a condução, caracterizando indícios de sonolência.'
  ],
  
  // BOCEJO DELAY (usa o mesmo texto do Bocejo)
  'Bocejo Delay': [
    'Reportado para a operação. Condutor identificado bocejando de forma recorrente durante a condução, caracterizando indícios de sonolência.'
  ],
  
  // SONOLÊNCIA DELAY (usa o mesmo texto do N1)
  'Sonolência Delay': [
    'Reportado para a operação. Foi identificada sonolência de N1 no condutor. Orienta-se a parada imediata por 30 minutos para descanso.'
  ],
  
  // RÁDIO
  'Rádio': [
    'Reportado para a operação. Foi identificado que o motorista está utilizando o rádio durante a condução em rodovia, sem necessidade aparente, o que vai contra a recomendação de uso apenas em cenários oportunos, como em estradas de terra. Essa condição compromete a capacidade de reação e aumenta significativamente o risco de acidentes.'
  ],
  
  // FADIGA N1
  'N1 - Orientar Parada 30 min': [
    'Reportado para a operação. Foi identificada sonolência de N1 no condutor. Orienta-se a parada imediata por 30 minutos para descanso.'
  ],
  
  'N1 – Orientar Parada 30 min': [
    'Reportado para a operação. Foi identificada sonolência de N1 no condutor. Orienta-se a parada imediata por 30 minutos para descanso.'
  ],
  
  // FADIGA N2
  'N2 - Orientar parada 60 min': [
    'Reportado para a operação. Foi identificada sonolência de N2 no condutor, com sinais moderados a intensa de fadiga. Orienta-se a parada imediata por 60 minutos para repouso, priorizando a segurança.'
  ],
  
  'N2 – Orientar Parada 60 min': [
    'Reportado para a operação. Foi identificada sonolência de N2 no condutor, com sinais moderados a intensa de fadiga. Orienta-se a parada imediata por 60 minutos para repouso, priorizando a segurança.'
  ],
  
  'N2 - Orientar Parada 60 min': [
    'Reportado para a operação. Foi identificada sonolência de N2 no condutor, com sinais moderados a intensa de fadiga. Orienta-se a parada imediata por 60 minutos para repouso, priorizando a segurança.'
  ],
  
  'N2 – Orientar parada 60 min': [
    'Reportado para a operação. Foi identificada sonolência de N2 no condutor, com sinais moderados a intensa de fadiga. Orienta-se a parada imediata por 60 minutos para repouso, priorizando a segurança.'
  ],
  
  // SEM CINTO DE SEGURANÇA OU CINTO DA FORMA INCORRETA
  'Não uso de cinto de segurança': [
    'Reportado para a operação. Condutor identificado sem o cinto de segurança ou utilizando-o de forma incorreta, infringindo normas de segurança e legislação vigente. Reforçar obrigatoriedade do uso adequado do cinto em todas as viagens.',
    'Reportado para a operação. Caroneiro identificado sem o uso do cinto de segurança, colocando em risco sua integridade física e infringindo normas de segurança da empresa.',
    'Reportado para a operação, condutor colocou o cinto de segurança com a frota em movimento.'
  ],
  
  'Não uso de cinto de segurança.': [
    'Reportado para a operação. Condutor identificado sem o cinto de segurança ou utilizando-o de forma incorreta, infringindo normas de segurança e legislação vigente. Reforçar obrigatoriedade do uso adequado do cinto em todas as viagens.',
    'Reportado para a operação. Caroneiro identificado sem o uso do cinto de segurança, colocando em risco sua integridade física e infringindo normas de segurança da empresa.',
    'Reportado para a operação, condutor colocou o cinto de segurança com a frota em movimento.'
  ],
  
  'Sem cinto de segurança': [
    'Reportado para a operação. Condutor identificado sem o cinto de segurança ou utilizando-o de forma incorreta, infringindo normas de segurança e legislação vigente. Reforçar obrigatoriedade do uso adequado do cinto em todas as viagens.',
    'Reportado para a operação. Caroneiro identificado sem o uso do cinto de segurança, colocando em risco sua integridade física e infringindo normas de segurança da empresa.',
    'Reportado para a operação, condutor colocou o cinto de segurança com a frota em movimento.'
  ],
  
  'Cinto': [
    'Reportado para a operação. Condutor identificado sem o cinto de segurança ou utilizando-o de forma incorreta, infringindo normas de segurança e legislação vigente. Reforçar obrigatoriedade do uso adequado do cinto em todas as viagens.',
    'Reportado para a operação. Caroneiro identificado sem o uso do cinto de segurança, colocando em risco sua integridade física e infringindo normas de segurança da empresa.',
    'Reportado para a operação, condutor colocou o cinto de segurança com a frota em movimento.'
  ],
  
  // Outros tipos que aparecem no dropdown
  'Comer e Beber ao Volante': [
    'Reportado para a operação. Condutor identificado realizando alimentação durante a condução, o que compromete a atenção e o controle do veículo. Reforçar as diretrizes de segurança operacional.'
  ],
  'Invalidar - Teste - Manutenção': []
};

// Função para obter textos baseado no tipo de alerta
function getTextosPadrao(tipoAlerta) {
  // Remove espaços extras e normaliza
  const tipo = tipoAlerta.trim();
  
  // Tenta buscar exatamente
  if (TEXTOS_PADRAO[tipo]) {
    return TEXTOS_PADRAO[tipo];
  }
  
  // Busca parcial (case insensitive)
  for (const key in TEXTOS_PADRAO) {
    if (key.toLowerCase() === tipo.toLowerCase()) {
      return TEXTOS_PADRAO[key];
    }
  }
  
  // Busca por palavras-chave
  const tipoLower = tipo.toLowerCase();
  
  if (tipoLower.includes('distraç') || tipoLower.includes('distrac')) {
    return TEXTOS_PADRAO['Distração'];
  }
  
  if (tipoLower.includes('n1') || tipoLower.includes('30 min')) {
    return TEXTOS_PADRAO['N1 - Orientar Parada 30 min'];
  }
  
  if (tipoLower.includes('n2') || tipoLower.includes('60 min')) {
    return TEXTOS_PADRAO['N2 - Orientar parada 60 min'];
  }
  
  if (tipoLower.includes('cinto')) {
    return TEXTOS_PADRAO['Não uso de cinto de segurança'];
  }
  
  if (tipoLower.includes('ausência') || tipoLower.includes('ausencia')) {
    return TEXTOS_PADRAO['Ausência'];
  }
  
  if (tipoLower.includes('conduta') || tipoLower.includes('consequência') || tipoLower.includes('consequencia')) {
    return TEXTOS_PADRAO['Conduta – Política de Consequência + Pontos no D-OLHO'];
  }
  
  return [];
}
