import { PlayIcon } from 'lucide-react';
import { Card } from '../../molecules/Card';
import { StudioTemplate } from '../../templates/StudioTemplate';
import { useProduction } from '../../../hooks/useProduction';

export function Studio() {
  const { selectedProduction, productions, selectProduction, deselectProduction } = useProduction();

  if (!selectedProduction) {
    return (
      <div className='w-screen bg-background p-4 flex flex-col gap-4'>
        <div className='flex flex-wrap gap-4'>
          {productions.map((production) => (
            <Card
              key={production.id}
              icon={<PlayIcon />}
              title={production.name}
              subtitle={production.description}
              quickLinks={[
                {
                  label: 'Ir para produção',
                  onClick: () => {
                    selectProduction(production);
                  },
                },
              ]}
            />
          ))}
        </div>
      </div>
    );
  }

  return <StudioTemplate onBack={deselectProduction} />;
}
