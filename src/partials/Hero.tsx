import {
  HeroAvatar,
  Section,
} from 'astro-boilerplate-components';

const Hero = () => (
  <Section>
    <HeroAvatar
      title={
        <>
         Take The Amen Clinic ADD Type Questionnaire
        </>
      }
      description={
        <>
          Drawn from the Book{' '}
          <a className="text-cyan-400 hover:underline" href="https://www.goodreads.com/book/show/310985.Healing_ADD">
            Healing ADD: The Breakthrough Program That Allows You to See and Heal the 6 Types of ADD
          </a>,
          this quiz helps you identify which of the 6 types of ADD you may have.
        </>
      }
    />
  </Section>
);

export { Hero };
