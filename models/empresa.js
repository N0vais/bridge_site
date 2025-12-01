const supabase = require ('../config/db.js');

class Empresa {
    static async find(){
        const { data, error } = await supabase.from('empresa').select('*');
        if(error){
            throw new Error("deu ruim");
            
        }else{
            return data;
        }
    }
    static async findById(id){
        const { data, error } = await supabase.from ( 'empresa').select('*').eq('id',id).single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }

    static async create (empresa){
        const { data, error } = await supabase.from ( 'empresa').insert(empresa).select().single();

         if(error){
            throw error;
        }else{
            return data;
        }
    }

    static async findByIdAndUpdate(id, empresa){

       const { data, error } = await supabase.from('empresa').update(empresa).eq('id', id).select().single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }

     static async findByIdAndDelete(id){

       const { data, error } = await supabase.from('empresa').delete().eq('id', id).select().single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }
}

module.exports = Empresa;