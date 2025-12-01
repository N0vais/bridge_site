const supabase = require ('../config/db.js');

class Gerente {
    static async find(){
        const { data, error } = await supabase.from('gerente').select('*');
        if(error){
            throw new Error("deu ruim");
            
        }else{
            return data;
        }
    }
    static async findById(id){
        const { data, error } = await supabase.from ( 'gerente').select('*').eq('id',id).single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }

    static async create (gerente){
        const { data, error } = await supabase.from ( 'gerente').insert(gerente).select().single();

         if(error){
            throw error;
        }else{
            return data;
        }
    }

    static async findByIdAndUpdate(id, gerente){

       const { data, error } = await supabase.from('gerenet').update(gerente).eq('id', id).select().single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }

     static async findByIdAndDelete(id){

       const { data, error } = await supabase.from('gerente').delete().eq('id', id).select().single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }
}

module.exports = Gerente;