# Rio Mapa Multimodal — Site

Este repositório hospeda a versão web estática do **Rio Mapa Multimodal**, um projeto que combina dados de bicicleta (BikeRio), ônibus (GTFS) e trilhos (MetrôRio, SuperVia e VLT) para mapear a cobertura multimodal da cidade do Rio de Janeiro em janelas de 30 minutos.

Acesse o mapa em: [rio.filipeluna.com](https://rio.filipeluna.com)

---

## Sobre

- O site é composto por arquivos HTML, CSS e JS servidos via GitHub Pages.
- Os dados são renderizados diretamente em Leaflet, com base em um arquivo GeoJSON exportado a partir do pipeline principal.
- Cada hexágono representa cobertura de transporte a até 400 metros de distância para um ou mais modais, de acordo com a janela selecionada.

---

## Dados e código-fonte

Para acessar o pipeline completo, dados de entrada, scripts e metodologia, consulte o repositório principal:

📂 [`filipeluna/rio-mapa-multimodal`](https://github.com/filipeluna/rio-mapa-multimodal)

---

## Licença

Este repositório está licenciado sob os termos da [Licença MIT](LICENSE).

