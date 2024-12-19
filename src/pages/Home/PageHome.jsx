import Cards from '../../Components/Card/Cards';
import styles from '../Home/Home.module.css';
import Header from '../../Components/Header/Header';
function PageHome(){
    return (<>
        <Header></Header>
        <div className={styles.Container}>
        <Cards></Cards>
        </div>
        
    
    </>);
}
export default PageHome;