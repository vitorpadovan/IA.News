---
titulo: "Falha histórica no kernel do Linux permite escalada de privilégios a invasores"
fonte: tecmundo
url: https://www.estadao.com.br/tecmundo/ciberseguranca/falha-historica-no-kernel-do-linux-permite-escalada-de-privilegios-a-invasores/
data_publicacao: 2026-10-14T18:40:00.000Z
coletado_em: 2026-10-15T01:07:38.860Z
topicos: ["ai"]
---
# Falha histórica no kernel do Linux permite escalada de privilégios a invasores

Uma falha de segurança descoberta no [kernel do Linux](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=de845981da67a6b049080c87e605130b0c30adc5) permite que usuários sem privilégios assumam o controle total de servidores e consigam escapar de máquinas virtuais para invadir o sistema hospedeiro. A vulnerabilidade afeta versões do sistema operacional lançadas ao longo dos últimos nove anos e já recebeu um ajuste emergencial.

Identificado como [“CVE-2026-74580?](https://github.com/zhangutah/security-research/tree/main/pocs/linux/cve-2026-74580) e apelidado de “Vghost”, o problema afeta o vhost, um componente do Linux responsável por acelerar a troca de dados entre o sistema principal e os ambientes virtualizados. Ao explorar o erro, um invasor consegue ler e escrever na memória do sistema sem encontrar barreiras de proteção e obter acesso de nível máximo (root).

O achado foi realizado pelos pesquisadores do Tencent Zhuque Lab, da China, com o auxílio da ferramenta Corvus AI. Em [relatório técnico](https://matrix.tencent.com/en/2026/10/12/vghost-cve-2026-74580) publicado na segunda-feira (12), os especialistas alertaram sobre o alcance da falha e defenderam a revisão de certos limites de segurança na computação em nuvem.

                                
                            

Em sistemas operacionais onde a porta de entrada estava aberta para qualquer usuário, a elevação de acesso ocorria de forma direta. No Ubuntu, o acesso inicial ficou restrito a usuários que já pertenciam ao grupo de virtualização (kvm), o que diminuiu a exposição inicial da plataforma.

### Respostas das distribuições e correções

O ajuste para eliminar a falha foi disponibilizado no código-fonte principal do Linux no dia 3 de agosto de 2026 sob a identificação “commit de845981da67?. A alteração força o sistema a limpar o histórico temporário sempre que uma reconfiguração de memória é solicitada, o que obriga o kernel a checar todas as permissões novamente.

Empresas de tecnologia e mantenedoras do sistema começaram a liberar correções para os usuários. A [Red Hat](https://access.redhat.com/security/cve/cve-2026-74580) atualizou o banco de dados de segurança e classificou o impacto da falha como importante, disponibilizando atualizações para o Red Hat Enterprise Linux nas versões 8, 9 e 10. A [Amazon Web Services](https://explore.alas.aws.amazon.com/CVE-2026-74580.html) e a [Oracle](https://linux.oracle.com/cve/CVE-2026-74580.html) também lançaram pacotes de correção para as distribuições e serviços em nuvem.

A [Canonical](https://ubuntu.com/security/CVE-2026-74580), responsável pelo Ubuntu, corrigiu a vulnerabilidade para a versão 22.04 LTS e indicou que o desenvolvimento de correções para os lançamentos 24.04 LTS e 26.04 LTS estava em andamento.

Até o momento, não há registros de que a vulnerabilidade tenha sido explorada em ataques reais. Os pesquisadores orientam que administradores de sistemas que não puderem aplicar as atualizações de kernel imediatamente devem restringir o acesso aos arquivos /dev/vhost-net e /dev/vhost-vsock, limitando as permissões apenas a serviços essenciais e confiáveis.

Siga o [TecMundo](https://www.estadao.com.br/tecmundo/) no [X](https://x.com/Tec_Mundo), [Instagram](https://www.instagram.com/tecmundo/), [Facebook](https://web.facebook.com/tecmundo/?locale=pt_BR&_rdc=1&_rdr) e [YouTube](https://www.youtube.com/@tecmundo) e assine a [nossa newsletter](https://thebrief-newsletter.beehiiv.com/) para receber as principais notícias e análises diretamente no seu e-mail.
