# Direção visual — Bueno Residence

## Intenção

A interface deve transmitir controle operacional, confiança e cuidado com patrimônio e pessoas. O produto é uma ferramenta de trabalho imobiliário: a informação vem antes da decoração e cada tela deve deixar claro o estado atual e a próxima ação possível.

## Princípios

1. **Sóbrio e humano:** azul profundo estrutura a navegação; superfícies claras e quentes evitam o aspecto de painel tecnológico genérico.
2. **Densidade moderada:** indicadores são compactos, listas priorizam leitura e formulários mantêm espaço suficiente para reduzir erros.
3. **Marca com contenção:** as quatro cores do símbolo aparecem no logotipo. Azul é a cor funcional principal; verde, âmbar e vermelho ficam reservados a estados.
4. **Profundidade funcional:** bordas e diferenças de superfície separam áreas. Sombras são discretas e usadas apenas em elementos elevados.
5. **Movimento explica estado:** transições curtas indicam troca, foco ou conclusão. Não há objetos flutuantes, parallax ou animação ornamental contínua.

## Tokens

```yaml
color:
  ink: "#172033"
  ink-muted: "#667085"
  brand: "#123B63"
  brand-strong: "#0B2947"
  action: "#176B87"
  canvas: "#F4F5F2"
  surface: "#FFFFFF"
  surface-subtle: "#ECEFEB"
  border: "#DDE2DE"
  success: "#287A59"
  warning: "#A96E1C"
  danger: "#B54747"
radius:
  control: "8px"
  panel: "12px"
  elevated: "16px"
space: [4, 8, 12, 16, 24, 32, 48]
motion:
  quick: "120ms"
  standard: "180ms"
  easing: "cubic-bezier(0.2, 0, 0, 1)"
```

## Tipografia

- Inter para leitura, formulários e dados.
- Montserrat somente para assinatura da marca e títulos curtos de primeiro nível.
- Texto normal nunca deve depender de caixa alta para criar hierarquia.
- Números operacionais usam alinhamento e peso, não tamanho excessivo.

## Componentes

- Botões primários são sólidos, sem gradiente e sem salto no hover.
- Cards não recebem todos a mesma sombra. Indicadores do dashboard formam uma faixa contínua em desktop.
- Tabelas usam cabeçalho discreto, linhas legíveis e rolagem horizontal no celular.
- Loading inicial usa skeleton apenas onde a estrutura futura é conhecida.
- Erro sempre informa o problema em texto e oferece nova tentativa quando possível.
- Estados vazios explicam o que falta; não usam ilustrações genéricas.

## Responsividade e acessibilidade

- Alvos interativos têm pelo menos 44 px no celular.
- Foco de teclado é visível e não depende apenas de cor.
- `prefers-reduced-motion` desliga animações não essenciais.
- Em telas pequenas, a navegação permanece acessível sem cobrir o conteúdo.

## Evitar

- gradientes multicoloridos, glow, glassmorphism e objetos flutuantes;
- animação repetida em cada card ou seção;
- bordas, raios e sombras idênticos em todos os blocos;
- textos promocionais em telas operacionais;
- bibliotecas visuais adicionadas para efeitos que CSS nativo resolve.
