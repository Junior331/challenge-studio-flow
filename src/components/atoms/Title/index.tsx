import { useProduction } from '../../../hooks/useProduction';

const Title = () => {
  const { selectedProduction } = useProduction();

  return <h1 className='text-2xl font-bold text-primary'>{selectedProduction?.name}</h1>;
};

export { Title };
