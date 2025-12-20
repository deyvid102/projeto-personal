import cron from 'node-cron';
import Projeto from '../model/ModelProjeto.js';

cron.schedule('0 0 * * *', async () => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    console.log('[CRON] Verificando status dos projetos...');

    /* ===============================
        1️⃣ ATIVAR PROJETOS AGENDADOS
    ================================ */

    const projetosParaAtivar = await Projeto.find({
        status: 'AGENDADO',
        data_inicio: { $exists: true, $lte: hoje }
    });

    for (const projeto of projetosParaAtivar) {

        // 🔐 Regra: apenas 1 projeto ativo por aluno
        const projetoAtivo = await Projeto.findOne({
        fk_aluno: projeto.fk_aluno,
        status: 'ATIVO'
        });

        if (!projetoAtivo) {
        projeto.status = 'ATIVO';
        await projeto.save();
        console.log(`[CRON] Projeto ATIVADO: ${projeto._id}`);
        }
    }

    /* ===============================
        2️⃣ CONCLUIR PROJETOS ATIVOS
    ================================ */

    const projetosParaConcluir = await Projeto.updateMany(
        {
        status: 'ATIVO',
        data_fim: { $lte: hoje }
        },
        {
        status: 'CONCLUIDO'
        }
    );

    if (projetosParaConcluir.modifiedCount > 0) {
        console.log(`[CRON] Projetos CONCLUÍDOS: ${projetosParaConcluir.modifiedCount}`);
    }

  } catch (err) {
    console.error('[CRONT] Erro ao atualizar status dos projetos')
  }
});
