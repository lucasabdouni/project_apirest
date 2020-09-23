import { getRepository } from 'typeorm';
import { startOfHour, parseISO } from 'date-fns';
import Agendamentos from '../models/Agendamentos';

interface Request {
  prestador_servico_id: string;
  data: string;
}
class AgendamentosController {
  public async store({
    prestador_servico_id,
    data,
  }: Request): Promise<Agendamentos> {
    const dataPassada = startOfHour(parseISO(data));
    const agendamentosRepository = getRepository(Agendamentos);
    const encontrarAgendamentoMesmaData = await agendamentosRepository.findOne({
      where: { data: dataPassada },
    });
    const agendamento = agendamentosRepository.create({
      prestador_servico_id,
      data: dataPassada,
    });

    if (encontrarAgendamentoMesmaData) {
      throw new Error('Agendamento já cadastrado para este horário');
    }
    await agendamentosRepository.save(agendamento);
    return agendamento;
  }
}
export default AgendamentosController;
