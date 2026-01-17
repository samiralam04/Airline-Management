import HeroSlider from '../components/home/HeroSlider';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import TravelTips from '../components/home/TravelTips';

const Home = () => {
    return (
        <div className="flex flex-col gap-12">
            <HeroSlider />
            <FeaturedDestinations />
            <TravelTips />
        </div>
    );
};

export default Home;
